#!/bin/sh
# Private, per-invocation authentication. No credentials enter the build context.
set +x
set -eu
umask 077

case "${1:-}" in
  check|push) mode=$1 ;;
  *) echo 'Usage: sh scripts/jenkins-gcp-auth.sh check|push' >&2; exit 2 ;;
esac
: "${GCLOUD_KEY:?Bind Jenkins Secret file gcp-jenkins-deployer-sa}"
: "${GCP_PROJECT:?GCP_PROJECT is required}"
: "${DEPLOY_AUTH_TMP_ROOT:?Jenkins must supply pwd(tmp: true) outside the build context}"
if [ ! -s "$GCLOUD_KEY" ] || [ ! -r "$GCLOUD_KEY" ]; then
  echo 'Jenkins credential gcp-jenkins-deployer-sa is empty or unreadable. Replace its Secret file with the Google JSON key.' >&2
  exit 1
fi
for tool in docker gcloud; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Required agent tool is missing: $tool" >&2; exit 1; }
done

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
mkdir -p "$DEPLOY_AUTH_TMP_ROOT"
auth_dir=$(mktemp -d "$DEPLOY_AUTH_TMP_ROOT/gcp-auth.XXXXXXXX")
cleanup() { rm -rf -- "$auth_dir"; }
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

export CLOUDSDK_CONFIG="$auth_dir/gcloud"
export DOCKER_CONFIG="$auth_dir/docker"
export CLOUDSDK_CORE_DISABLE_PROMPTS=1
unset CLOUDSDK_ACTIVE_CONFIG_NAME CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE CLOUDSDK_AUTH_ACCESS_TOKEN CLOUDSDK_AUTH_IMPERSONATE_SERVICE_ACCOUNT
mkdir -p "$CLOUDSDK_CONFIG" "$DOCKER_CONFIG"

# The Docker daemon cannot bind-mount the Jenkins agent's credential path.
# Feed it through stdin; the validator has no network and emits no key to logs.
docker run --rm -i --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --entrypoint node node:20-alpine \
  --input-type=module -e "$(cat "$script_dir/validate-gcp-key.mjs")" \
  < "$GCLOUD_KEY" > "$auth_dir/key.json"
echo 'Service-account JSON validated; checking Google authentication.'
if ! gcloud auth activate-service-account --quiet --project="$GCP_PROJECT" --key-file="$auth_dir/key.json"; then
  echo 'Google rejected the validated service-account key. Check whether it was disabled/deleted or replace the Jenkins Secret file with a valid JSON key.' >&2
  exit 1
fi
# Separate commands preserve gcloud's exit status under POSIX sh. A failing
# token command must never be hidden by the exit status of docker login.
gcloud auth print-access-token > "$auth_dir/access-token"
if [ ! -s "$auth_dir/access-token" ]; then
  echo 'Google authentication returned an empty access token.' >&2
  exit 1
fi

if [ "$mode" = check ]; then
  echo 'Google credential preflight passed.'
else
  : "${IMAGE_REPO:?IMAGE_REPO is required}"
  : "${SHORT_SHA:?SHORT_SHA is required}"
  registry=${IMAGE_REPO%%/*}
  docker login -u oauth2accesstoken --password-stdin "https://$registry" < "$auth_dir/access-token"
  docker push "${IMAGE_REPO}:${SHORT_SHA}"
  docker push "${IMAGE_REPO}:latest"
fi
