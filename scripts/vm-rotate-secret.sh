#!/usr/bin/env bash
set -euo pipefail

NEW_SECRET=$(openssl rand -hex 32)
sudo sed -i "s|^APP_SECRET=.*|APP_SECRET=${NEW_SECRET}|" /etc/xaiht/app.env

echo "==> New APP_SECRET set (first 12 chars):"
sudo grep '^APP_SECRET=' /etc/xaiht/app.env | cut -d= -f2 | cut -c1-12

echo "==> Restarting xaiht-app"
sudo systemctl restart xaiht-app
sleep 4

echo "==> Probe"
curl -sS -o /dev/null -w "home: HTTP %{http_code}\n" http://127.0.0.1:3000/
