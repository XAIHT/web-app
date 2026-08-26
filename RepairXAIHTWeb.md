# RepairXAIHTWeb.md — Rebuild the xaiht.org CI/CD from scratch

**When to use this document:** Everything in `C:\Development\jenkins-docker\` is gone or broken (Docker/Gordon incident, laptop wipe, or you simply want to rebuild). You still have:

- Access to this GitHub repo (`github.com/XAIHT/web-app`)
- Access to the GCP project **`xaiht-492820`** with `gcloud` on your machine
- Docker Desktop for Windows installed and running
- The VM `xaiht-vm` in `us-central1-a` still running (its `xaiht-app` systemd unit + `cloud-sql-proxy` haven't been touched)

If any of those are also gone, this document is not enough — you'll need to reprovision the VM (see the memory file `project_xaiht_gcp_deployment.md`) before following this.

This runbook was written **2026-08-26** after Gordon (Docker Desktop's AI assistant) wiped `keys/`, replaced the Dockerfiles, and swapped the working setup for a broken JNLP-agent one. Everything below has been executed and verified end-to-end — build #1 after recovery deployed commit `945cba6` and xaiht.org returned 200.

---

## Prerequisites (one-time on the machine)

1. **Docker Desktop for Windows** running with Linux containers (WSL2 backend).
2. **Google Cloud SDK** installed and authenticated:
   ```powershell
   gcloud auth login          # opens browser
   gcloud config set project xaiht-492820
   ```
3. **Git for Windows** with Git Bash (used for `ssh-keygen`).
4. **This repo cloned** at `C:\Development\XAIHT\web-app\` on the `main` branch.

---

## The 10-step rebuild

Run the commands from **Git Bash** unless the prompt says PowerShell. Copy each block as-is.

### 1) Kill any broken Jenkins containers + wipe the polluted volume

```bash
cd /c/Development
docker ps -a --filter name=jenkins --format "{{.Names}}: {{.Status}}"
# If anything is listed, cleanly stop and wipe:
mkdir -p /c/Development/jenkins-docker && cd /c/Development/jenkins-docker
docker compose down -v 2>/dev/null || true
```

### 2) Create the workspace directory tree

```bash
mkdir -p /c/Development/jenkins-docker/{casc,keys,scripts}
cd /c/Development/jenkins-docker
```

### 3) Generate the two SSH keypairs

```bash
ssh-keygen -t ed25519 -f ./keys/jenkins_agent -N "" -C "jenkins-controller-to-agent"
ssh-keygen -t ed25519 -f ./keys/vm_deploy      -N "" -C "jenkins-deployer@xaiht-vm"
```

You now have four files in `./keys/`:
- `jenkins_agent` (private) + `jenkins_agent.pub` (public) — controller ↔ agent
- `vm_deploy` (private) + `vm_deploy.pub` (public) — Jenkins → xaiht-vm

Print them so you can paste values into the config files below:

```bash
echo "--- controller<->agent PUBLIC ---"
cat ./keys/jenkins_agent.pub
echo "--- controller<->agent PRIVATE ---"
cat ./keys/jenkins_agent
echo "--- vm PUBLIC ---"
cat ./keys/vm_deploy.pub
echo "--- vm PRIVATE ---"
cat ./keys/vm_deploy
```

### 4) Rotate the GCP service-account key

The service account `jenkins-deployer@xaiht-492820.iam.gserviceaccount.com` should still exist. Confirm:

```bash
gcloud iam service-accounts describe jenkins-deployer@xaiht-492820.iam.gserviceaccount.com --format="value(email,disabled)"
```

If the SA is missing (unlikely — it survives volume wipes), recreate it:

```bash
gcloud iam service-accounts create jenkins-deployer \
  --display-name="Jenkins Deployer" \
  --description="Used by Jenkins on Docker Desktop to build/push xaiht-app images"
gcloud projects add-iam-policy-binding xaiht-492820 \
  --member="serviceAccount:jenkins-deployer@xaiht-492820.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer" --condition=None
```

**Revoke any old USER_MANAGED key** (its private JSON is lost, so it's a dead cred you don't want floating):

```bash
gcloud iam service-accounts keys list \
  --iam-account=jenkins-deployer@xaiht-492820.iam.gserviceaccount.com \
  --format="value(name.basename())" \
  --filter="keyType=USER_MANAGED"
# For every id printed, run:
#   gcloud iam service-accounts keys delete <ID> \
#     --iam-account=jenkins-deployer@xaiht-492820.iam.gserviceaccount.com --quiet
```

**Create a fresh key** and download the JSON:

```bash
gcloud iam service-accounts keys create ./keys/jenkins-deployer-sa.json \
  --iam-account=jenkins-deployer@xaiht-492820.iam.gserviceaccount.com
```

### 5) Re-provision xaiht-vm with the new SSH pubkey

Substitute your **actual** `vm_deploy.pub` string in `PUB_KEY` before running.

Write `scripts/setup-vm-deployer.sh`:

```bash
cat > /c/Development/jenkins-docker/scripts/setup-vm-deployer.sh <<'SH'
#!/usr/bin/env bash
set -euo pipefail
USER_NAME=jenkins-deployer
PUB_KEY="<<< PASTE YOUR vm_deploy.pub HERE >>>"

if ! id "$USER_NAME" >/dev/null 2>&1; then
  sudo useradd --create-home --shell /bin/bash "$USER_NAME"
fi
sudo install -d -m 700 -o "$USER_NAME" -g "$USER_NAME" "/home/$USER_NAME/.ssh"
AUTH_FILE="/home/$USER_NAME/.ssh/authorized_keys"
sudo touch "$AUTH_FILE"
# Drop any old jenkins-deployer@xaiht-vm ed25519 lines (rotated)
sudo sed -i '/jenkins-deployer@xaiht-vm$/d' "$AUTH_FILE"
if ! sudo grep -qF "$PUB_KEY" "$AUTH_FILE"; then
  echo "$PUB_KEY" | sudo tee -a "$AUTH_FILE" >/dev/null
fi
sudo chmod 600 "$AUTH_FILE"
sudo chown "$USER_NAME:$USER_NAME" "$AUTH_FILE"

SUDOERS_FILE=/etc/sudoers.d/jenkins-deployer
sudo tee "$SUDOERS_FILE" >/dev/null <<EOF
$USER_NAME ALL=(root) NOPASSWD: /bin/systemctl restart xaiht-app, /bin/systemctl status xaiht-app, /usr/bin/systemctl restart xaiht-app, /usr/bin/systemctl status xaiht-app
EOF
sudo chmod 440 "$SUDOERS_FILE"
sudo visudo -cf "$SUDOERS_FILE"
echo "OK: $USER_NAME provisioned with deploy-only sudo rights"
SH
```

Copy and run on the VM:

```bash
gcloud compute scp ./scripts/setup-vm-deployer.sh xaiht-vm:setup-vm-deployer.sh --zone=us-central1-a
gcloud compute ssh xaiht-vm --zone=us-central1-a --command="bash ~/setup-vm-deployer.sh"
```

Verify the new key + sudo rule work:

```bash
ssh -i ./keys/vm_deploy -o StrictHostKeyChecking=accept-new \
    -o UserKnownHostsFile=./keys/known_hosts \
    jenkins-deployer@136.116.194.179 "whoami; sudo -n -l | grep xaiht-app"
```

Expected output: `jenkins-deployer` and the NOPASSWD line.

### 6) Write the six Jenkins config files

**a) `Dockerfile.controller`** — the Jenkins controller image (LTS + plugins pre-installed via `jenkins-plugin-cli`):

```dockerfile
FROM jenkins/jenkins:lts-jdk17
USER root
ENV JAVA_OPTS="-Djenkins.install.runSetupWizard=false"
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt
USER jenkins
```

**b) `Dockerfile.agent`** — the agent image, based on `jenkins/ssh-agent` + `docker-ce-cli` + `docker-buildx-plugin` + `google-cloud-cli`:

```dockerfile
FROM jenkins/ssh-agent:latest-jdk17
USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      ca-certificates curl gnupg lsb-release apt-transport-https git python3 sudo \
 && install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://download.docker.com/linux/debian/gpg \
      | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
 && chmod a+r /etc/apt/keyrings/docker.gpg \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release; echo $VERSION_CODENAME) stable" \
      > /etc/apt/sources.list.d/docker.list \
 && curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg \
      | gpg --dearmor -o /etc/apt/keyrings/cloud.google.gpg \
 && echo "deb [signed-by=/etc/apt/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" \
      > /etc/apt/sources.list.d/google-cloud-sdk.list \
 && apt-get update \
 && apt-get install -y --no-install-recommends docker-ce-cli docker-buildx-plugin google-cloud-cli \
 && rm -rf /var/lib/apt/lists/*
COPY agent-entrypoint.sh /usr/local/bin/agent-entrypoint.sh
RUN chmod +x /usr/local/bin/agent-entrypoint.sh
ENTRYPOINT ["/usr/local/bin/agent-entrypoint.sh"]
```

**c) `agent-entrypoint.sh`** — makes the mounted docker socket accessible to the `jenkins` user, then hands off to `setup-sshd`:

```bash
#!/usr/bin/env bash
set -e
if [ -S /var/run/docker.sock ]; then
  chgrp jenkins /var/run/docker.sock 2>/dev/null || true
  chmod 660 /var/run/docker.sock 2>/dev/null || true
fi
exec setup-sshd "$@"
```

Make sure this file has **LF line endings** (not CRLF), or the container's `/bin/bash` won't parse it. If unsure: `dos2unix agent-entrypoint.sh`.

**d) `plugins.txt`** — the plugin set Jenkins needs (CASC + everything the pipeline uses):

```
configuration-as-code
git
workflow-aggregator
pipeline-stage-view
ssh-slaves
ssh-credentials
credentials
credentials-binding
matrix-auth
job-dsl
timestamper
ws-cleanup
docker-workflow
github
blueocean
```

**e) `docker-compose.yml`** — two services on a private bridge network; SA JSON bind-mounted read-only into the controller:

```yaml
services:
  jenkins:
    build:
      context: .
      dockerfile: Dockerfile.controller
    image: jenkins-controller:local
    container_name: jenkins
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - ./casc:/var/jenkins_casc:ro
      - ./keys/jenkins-deployer-sa.json:/run/secrets/jenkins-deployer-sa.json:ro
    environment:
      JAVA_OPTS: "-Djenkins.install.runSetupWizard=false"
      CASC_JENKINS_CONFIG: /var/jenkins_casc/jenkins.yaml
      JENKINS_ADMIN_ID: admin
      JENKINS_ADMIN_PASSWORD: admin
    networks:
      - jenkins-net
    depends_on:
      - agent

  agent:
    build:
      context: .
      dockerfile: Dockerfile.agent
    image: jenkins-agent:local
    container_name: jenkins-agent
    restart: unless-stopped
    environment:
      JENKINS_AGENT_SSH_PUBKEY: "<<< PASTE YOUR jenkins_agent.pub HERE (single line, no trailing newline) >>>"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - jenkins-net

volumes:
  jenkins_home:

networks:
  jenkins-net:
    driver: bridge
```

**f) `casc/jenkins.yaml`** — declarative Jenkins configuration. **You must paste both private keys inline** — indented to match the `privateKey: |` YAML block:

```yaml
jenkins:
  systemMessage: "Jenkins on Docker Desktop - configured by JCasC"
  numExecutors: 0
  mode: EXCLUSIVE
  remotingSecurity:
    enabled: true
  securityRealm:
    local:
      allowsSignup: false
      users:
        - id: "${JENKINS_ADMIN_ID}"
          password: "${JENKINS_ADMIN_PASSWORD}"
  authorizationStrategy:
    loggedInUsersCanDoAnything:
      allowAnonymousRead: false
  nodes:
    - permanent:
        name: "docker-agent-1"
        labelString: "linux docker ssh"
        remoteFS: "/home/jenkins/agent"
        numExecutors: 2
        mode: NORMAL
        retentionStrategy: "always"
        launcher:
          ssh:
            host: "agent"
            port: 22
            credentialsId: "agent-ssh-key"
            sshHostKeyVerificationStrategy:
              nonVerifyingKeyVerificationStrategy: {}

credentials:
  system:
    domainCredentials:
      - credentials:
          - basicSSHUserPrivateKey:
              scope: SYSTEM
              id: "agent-ssh-key"
              username: "jenkins"
              description: "SSH key controller -> docker-agent-1"
              privateKeySource:
                directEntry:
                  privateKey: |
                    <<< PASTE FULL keys/jenkins_agent private key here, every line indented 20 spaces >>>
          - basicSSHUserPrivateKey:
              scope: GLOBAL
              id: "xaiht-vm-deployer-ssh"
              username: "jenkins-deployer"
              description: "SSH key Jenkins -> xaiht-vm (deploy account)"
              privateKeySource:
                directEntry:
                  privateKey: |
                    <<< PASTE FULL keys/vm_deploy private key here, every line indented 20 spaces >>>
          - file:
              scope: GLOBAL
              id: "gcp-jenkins-deployer-sa"
              fileName: "jenkins-deployer-sa.json"
              description: "GCP service account key (jenkins-deployer@xaiht-492820)"
              secretBytes: "${readFileBase64:/run/secrets/jenkins-deployer-sa.json}"

unclassified:
  location:
    url: "http://localhost:8080/"

jobs:
  - script: >
      pipelineJob('xaiht-deploy') {
        description('Build, push, and deploy xaiht.org web-app to GCP')
        properties {
          githubProjectUrl('https://github.com/XAIHT/web-app/')
        }
        triggers {
          githubPush()
        }
        definition {
          cpsScm {
            scm {
              git {
                remote {
                  url('https://github.com/XAIHT/web-app.git')
                }
                branch('*/main')
              }
            }
            scriptPath('Jenkinsfile')
            lightweight(true)
          }
        }
      }
```

> **Inlining tip.** In git-bash, indent a key file to 20 spaces on the fly:
> ```bash
> sed 's/^/                    /' ./keys/jenkins_agent
> ```
> Paste that output where indicated.

### 7) Build + start

```bash
cd /c/Development/jenkins-docker
docker compose up -d --build
```

First build takes 4–8 min (pull Jenkins LTS + install plugins, then pull `jenkins/ssh-agent` + apt-install docker/buildx/gcloud).

### 8) Wait for Jenkins to come up + confirm the job exists

```bash
until curl -fsS -u admin:admin -o /dev/null http://localhost:8080/login; do sleep 3; done
curl -fsS -u admin:admin http://localhost:8080/api/json?tree=jobs%5Bname%5D
# Expected: {"_class":"...","jobs":[{"_class":"...","name":"xaiht-deploy"}]}
```

If the `xaiht-deploy` job is missing on **first boot** (known JCasC + job-dsl race), reload once:

```bash
CRUMB=$(curl -fsS -u admin:admin --cookie-jar /tmp/jc.cookies \
        http://localhost:8080/crumbIssuer/api/json \
      | python -c "import sys,json;d=json.load(sys.stdin);print(f\"{d['crumbRequestField']}:{d['crumb']}\")")
curl -fsS -u admin:admin -X POST --cookie /tmp/jc.cookies -H "$CRUMB" \
     -o /dev/null -w "reload=%{http_code}\n" http://localhost:8080/reload
```

Subsequent Jenkins restarts load the job normally — this is a first-boot-only quirk.

### 9) Verify the agent is online

```bash
curl -fsS -u admin:admin http://localhost:8080/computer/docker-agent-1/api/json \
  | python -c "import sys,json;d=json.load(sys.stdin);print('offline:',d['offline'],'executors:',d['numExecutors'])"
# Expected: offline: False executors: 2
```

### 10) Trigger a build to verify end-to-end

Open **http://localhost:8080/job/xaiht-deploy/** in a browser and click **Build Now**, OR trigger via API:

```bash
CRUMB=$(curl -fsS -u admin:admin --cookie-jar /tmp/jc.cookies \
        http://localhost:8080/crumbIssuer/api/json \
      | python -c "import sys,json;d=json.load(sys.stdin);print(f\"{d['crumbRequestField']}:{d['crumb']}\")")
curl -fsS -u admin:admin -X POST --cookie /tmp/jc.cookies -H "$CRUMB" \
     "http://localhost:8080/job/xaiht-deploy/build"
```

Watch the console at `http://localhost:8080/job/xaiht-deploy/lastBuild/console`. All 5 stages should turn green in about 2 minutes:

1. **Checkout** — clones `github.com/XAIHT/web-app` at `main`
2. **Build image** — `docker build` with BuildKit (uses cached npm layer if unchanged)
3. **Push to Artifact Registry** — activates SA, docker login, pushes `:<short-sha>` and `:latest`
4. **Deploy: restart on VM** — SSH into `jenkins-deployer@136.116.194.179`, `sudo systemctl restart xaiht-app`, poll `systemctl is-active` for up to 3 minutes
5. **Smoke test** — `curl https://xaiht.org/` up to 10 times, pass on 200/302/304

Console tail on success:
```
Deployed <short-sha> to https://xaiht.org
Finished: SUCCESS
```

---

## What the pipeline actually does (in the [Jenkinsfile](Jenkinsfile) at the repo root)

- Tags images `us-central1-docker.pkg.dev/xaiht-492820/xaiht-images/xaiht-app:<git-short-sha>` and `:latest`.
- SSHes to `jenkins-deployer@136.116.194.179` (the VM's static IP; DNS: xaiht.org, www.xaiht.org).
- Runs `sudo systemctl restart xaiht-app`. The unit's `ExecStartPre=docker pull` fetches the newly pushed `:latest`. Because `docker pull` sometimes exceeds `TimeoutStartSec`, the pipeline **polls `systemctl is-active` for 3 minutes** instead of trusting `systemctl restart`'s exit code (which auto-heals via `Restart=always`).

---

## Direction-of-trust separation (deliberate)

- The **SA JSON** can push images to Artifact Registry but has zero access to the VM.
- The **SSH key** can restart `xaiht-app` (nothing else — sudoers rule pins commands) but has zero access to Artifact Registry.

A leaked SA key can't deploy malicious code; a leaked SSH key can't replace the image. Losing either is one revocation/one regeneration away from safe again — exactly what this document walks through.

---

## Troubleshooting

**`xaiht-deploy` job never appears** → run the `/reload` in step 8. If it still doesn't appear, `docker compose logs jenkins | grep -i job` — look for `createOrUpdateConfig for xaiht-deploy`. If missing, JCasC didn't run — check `docker compose logs jenkins | grep -iE 'casc|error'`.

**Agent `offline: True`** → `docker compose restart agent`, then in Jenkins UI go to **Manage Jenkins → Nodes → docker-agent-1 → Launch agent**. If it still fails, the private key in `casc/jenkins.yaml` doesn't match what `JENKINS_AGENT_SSH_PUBKEY` in `docker-compose.yml` was set to. Re-check step 6a and 6e.

**Build step fails: `COPY failed: package-lock.json`** → this repo commits `package-lock.json` (as of 2026-05-10). If it's missing, run `npm install --package-lock-only --no-audit` at the repo root and push the resulting file to main.

**Build step fails: `--mount option requires BuildKit`** → the pipeline sets `DOCKER_BUILDKIT=1` in `environment` and the agent has `docker-buildx-plugin`. If you see this error, the agent image wasn't rebuilt after step 7 — `docker compose build agent && docker compose up -d`.

**Deploy fails: `Job for xaiht-app.service failed because a timeout was exceeded`** → this is expected on slow `docker pull` and shouldn't fail the pipeline (the poller handles it). If it does fail the pipeline, someone shortened the poll loop or removed the `|| echo` fallback. Restore the Jenkinsfile from git.

**Deploy fails: `sudo: a password is required`** → the sudoers rule doesn't include the exact command line the pipeline runs. Re-run `scripts/setup-vm-deployer.sh` on the VM (step 5). The rule matches ONLY the command lines listed in it; a `--no-pager` or extra flag will bypass NOPASSWD and prompt.

**xaiht.org itself is down (not just the pipeline)** → this doc doesn't cover that. See `project_xaiht_gcp_deployment.md` in Claude's memory. First check: `gcloud compute ssh xaiht-vm --zone=us-central1-a --command="sudo systemctl status xaiht-app cloud-sql-proxy nginx"`.

---

## Recovery of last resort

If step 5 (SSH to the VM) fails because the `jenkins-deployer` user itself is broken:

```bash
# From your workstation using YOUR gcloud identity:
gcloud compute ssh xaiht-vm --zone=us-central1-a
# On the VM:
sudo userdel -r jenkins-deployer 2>/dev/null || true
sudo rm -f /etc/sudoers.d/jenkins-deployer
exit
# Then re-run step 5.
```

If the SA `jenkins-deployer` itself has been deleted, the recreation lines in step 4 (`gcloud iam service-accounts create ...` and the IAM binding) handle it.

If you've lost the GCP project entirely — this is beyond the scope of a rebuild. Restore from Google Cloud's undelete window (30 days) or engage Google support.

---

## Post-rebuild housekeeping

- Rotate the `admin/admin` Jenkins password before ever exposing the port (Cloudflare Tunnel plan below).
- Add `keys/` to any git ignore rules if you ever version-control `C:\Development\jenkins-docker\`.
- Optional: set up a Cloudflare Tunnel so `jenkins.xaiht.org` reaches localhost:8080 and GitHub can send push webhooks (auto-deploy on `git push`). See the "Open / not-done" list in `project_xaiht_jenkins_cicd.md` in Claude's memory.
