#!/usr/bin/env bash
set -euo pipefail

# Run drizzle-kit push against Cloud SQL via the local Cloud SQL Auth Proxy.
# Reads DATABASE_URL directly from /etc/xaiht/app.env (the same source the
# app uses) so no secrets need to live in this script.
#
# Uses the production app image which already has drizzle-kit in node_modules,
# and mounts the schema/config files from $HOME/drizzle-work into /work.

IMAGE=us-central1-docker.pkg.dev/xaiht-492820/xaiht-images/xaiht-app:latest
DB_URL="$(sudo grep '^DATABASE_URL=' /etc/xaiht/app.env | cut -d= -f2-)"
if [ -z "${DB_URL}" ]; then
  echo "DATABASE_URL not found in /etc/xaiht/app.env — populate it first via vm-update-env.sh" >&2
  exit 1
fi

echo "==> Running drizzle-kit push (creates/updates users + notes tables)"
sudo docker run --rm \
  --network host \
  -e DATABASE_URL="${DB_URL}" \
  -v "$HOME/drizzle-work:/work" \
  -w /work \
  --entrypoint sh \
  "${IMAGE}" \
  -c "cp -r /app/node_modules . && npx drizzle-kit push --force"

echo "==> Verifying tables exist"
sudo docker run --rm \
  --network host \
  -e DB_URL="${DB_URL}" \
  --entrypoint sh \
  "${IMAGE}" \
  -c 'node -e "const m=require(\"mysql2/promise\");(async()=>{const c=await m.createConnection(process.env.DB_URL);const [r]=await c.query(\"SHOW TABLES\");console.log(r);await c.end();})()"'
