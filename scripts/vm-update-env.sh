#!/usr/bin/env bash
set -euo pipefail

# Writes /etc/xaiht/app.env on the VM. Secrets are passed in as env vars —
# DO NOT hardcode here. See scripts/.deploy-secrets.env.example.
#
# Run from local machine via:
#   set -a; source scripts/.deploy-secrets.env; set +a
#   gcloud compute scp scripts/vm-update-env.sh xaiht-vm:vm-update-env.sh --zone=us-central1-a
#   gcloud compute ssh xaiht-vm --zone=us-central1-a --command="\
#     DB_PASSWORD='$DB_PASSWORD' \
#     GOOGLE_CLIENT_ID='$GOOGLE_CLIENT_ID' \
#     GOOGLE_CLIENT_SECRET='$GOOGLE_CLIENT_SECRET' \
#     OWNER_GOOGLE_SUB='${OWNER_GOOGLE_SUB:-}' \
#     bash ~/vm-update-env.sh"

: "${DB_PASSWORD:?DB_PASSWORD env var is required}"
: "${GOOGLE_CLIENT_ID:?GOOGLE_CLIENT_ID env var is required}"
: "${GOOGLE_CLIENT_SECRET:?GOOGLE_CLIENT_SECRET env var is required}"
OWNER_GOOGLE_SUB="${OWNER_GOOGLE_SUB:-}"

# Reuse existing APP_SECRET if one is already set (otherwise generate fresh).
# Rotating APP_SECRET invalidates every existing session.
if sudo grep -q '^APP_SECRET=' /etc/xaiht/app.env 2>/dev/null \
  && [ "$(sudo grep '^APP_SECRET=' /etc/xaiht/app.env | cut -d= -f2-)" != "placeholder" ]; then
  APP_SECRET=$(sudo grep '^APP_SECRET=' /etc/xaiht/app.env | cut -d= -f2-)
  echo "==> Reusing existing APP_SECRET"
else
  APP_SECRET=$(openssl rand -hex 32)
  echo "==> Generated new APP_SECRET"
fi

sudo mkdir -p /etc/xaiht
sudo tee /etc/xaiht/app.env > /dev/null <<EOF
NODE_ENV=production
PORT=3000

DATABASE_URL=mysql://xaiht-app:${DB_PASSWORD}@127.0.0.1:3306/xaiht

APP_SECRET=${APP_SECRET}

GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

PUBLIC_BASE_URL=https://xaiht.org

OWNER_GOOGLE_SUB=${OWNER_GOOGLE_SUB}
EOF

sudo chmod 600 /etc/xaiht/app.env
echo "==> /etc/xaiht/app.env updated. Keys present:"
sudo grep -E '^[A-Z_]+=' /etc/xaiht/app.env | cut -d= -f1
