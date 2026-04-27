#!/usr/bin/env bash
set -euo pipefail

DOMAIN=xaiht.org
EMAIL=mikespei64bit@gmail.com

echo "==> Installing nginx and certbot"
sudo DEBIAN_FRONTEND=noninteractive apt-get update -qq
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx certbot python3-certbot-nginx

echo "==> Writing initial nginx site for ${DOMAIN} (HTTP only — certbot will add HTTPS)"
sudo tee /etc/nginx/sites-available/xaiht.conf > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    client_max_body_size 25m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/xaiht.conf /etc/nginx/sites-enabled/xaiht.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "==> Requesting Let's Encrypt cert for ${DOMAIN} and www.${DOMAIN}"
sudo certbot --nginx \
  --non-interactive --agree-tos \
  --email "${EMAIL}" \
  --redirect \
  -d "${DOMAIN}" -d "www.${DOMAIN}"

echo "==> Final nginx test"
sudo nginx -t

echo "==> Local HTTPS probe"
curl -sS -o /dev/null -w "HTTPS %{http_code} from https://${DOMAIN}/\n" "https://${DOMAIN}/" || echo "(probe failed)"
