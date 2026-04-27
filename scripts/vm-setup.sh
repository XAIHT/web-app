#!/usr/bin/env bash
set -euo pipefail

PROJECT=xaiht-492820
REGION=us-central1
INSTANCE_CONN="${PROJECT}:${REGION}:xaiht-db"
IMAGE="us-central1-docker.pkg.dev/${PROJECT}/xaiht-images/xaiht-app:latest"
PROXY_VER="v2.14.3"

echo "==> Installing Cloud SQL Auth Proxy ${PROXY_VER}"
sudo curl -fsSL "https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/${PROXY_VER}/cloud-sql-proxy.linux.amd64" \
  -o /usr/local/bin/cloud-sql-proxy
sudo chmod +x /usr/local/bin/cloud-sql-proxy
/usr/local/bin/cloud-sql-proxy --version

echo "==> Configuring docker auth for Artifact Registry"
sudo mkdir -p /root/.docker
sudo gcloud auth configure-docker us-central1-docker.pkg.dev --quiet

echo "==> Skipping /etc/xaiht/app.env — populate it via vm-update-env.sh after this script."
echo "    See scripts/.deploy-secrets.env.example for the secrets you need."
sudo mkdir -p /etc/xaiht

echo "==> Writing cloud-sql-proxy.service"
sudo tee /etc/systemd/system/cloud-sql-proxy.service > /dev/null <<EOF
[Unit]
Description=Cloud SQL Auth Proxy
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/cloud-sql-proxy --address 127.0.0.1 --port 3306 ${INSTANCE_CONN}
Restart=always
RestartSec=5
User=root

[Install]
WantedBy=multi-user.target
EOF

echo "==> Writing xaiht-app.service"
sudo tee /etc/systemd/system/xaiht-app.service > /dev/null <<EOF
[Unit]
Description=xaiht.org app container
After=docker.service cloud-sql-proxy.service
Requires=docker.service cloud-sql-proxy.service

[Service]
Type=simple
Restart=always
RestartSec=10
ExecStartPre=-/usr/bin/docker stop xaiht-app
ExecStartPre=-/usr/bin/docker rm xaiht-app
ExecStartPre=/usr/bin/docker pull ${IMAGE}
ExecStart=/usr/bin/docker run --rm --name xaiht-app --network host --env-file /etc/xaiht/app.env ${IMAGE}
ExecStop=/usr/bin/docker stop xaiht-app

[Install]
WantedBy=multi-user.target
EOF

echo "==> Reloading systemd and starting services"
sudo systemctl daemon-reload
sudo systemctl enable --now cloud-sql-proxy.service
sleep 3
sudo systemctl enable --now xaiht-app.service
sleep 8

echo "==> cloud-sql-proxy status"
sudo systemctl status cloud-sql-proxy.service --no-pager -l | head -25
echo
echo "==> xaiht-app status"
sudo systemctl status xaiht-app.service --no-pager -l | head -25
echo
echo "==> Local HTTP probe"
curl -sS -o /dev/null -w "HTTP %{http_code} from localhost:3000\n" http://127.0.0.1:3000/ || echo "(probe failed — container may still be starting)"
