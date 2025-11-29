#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

#########  CONFIG (edit here if needed)  #########
DOMAIN="agatuvoice.online"                     # your domain
EMAIL="you@example.com"                        # email for certbot (letsencrypt)
REPO="https://github.com/ghsjulian/echoda.git" # repo URL
APP_DIR="/root"                         # project location (inside root as requested)
BACKEND_DIR="${APP_DIR}/server"
CLIENT_DIR="${APP_DIR}/client"
BUILD_COPY_DIR="/srv/echoda_build"             # where nginx will serve static files from
BACKEND_PORT=5000                              # port your Node backend will listen on
MONGO_URI="mongodb://localhost:27017/echoda"   # local mongodb
PM2_APP_NAME="echoda-server"
NODE_SETUP=true                                # set to false if node already installed
##################################################

echo "=== Deployment script started: $(date) ==="
echo "Domain: ${DOMAIN}"
echo "Repo:   ${REPO}"
echo

# 1) Update system and install required packages
echo "1) Updating apt and installing packages..."
apt update
apt -y upgrade

apt install -y git curl build-essential nginx certbot python3-certbot-nginx

# Install Node.js LTS if requested / missing
if ${NODE_SETUP}; then
  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "-> Installing Node.js LTS (NodeSource)..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt-get install -y nodejs
  else
    echo "-> Node/npm already installed."
  fi
fi

# Install pm2 globally
if ! command -v pm2 >/dev/null 2>&1; then
  echo "-> Installing pm2 globally..."
  npm install -g pm2
else
  echo "-> pm2 already installed."
fi

# 2) Ensure MongoDB (local) is running
echo
echo "2) Checking local MongoDB service..."
if systemctl is-active --quiet mongod; then
  echo "-> mongod is active."
else
  echo "-> mongod is not active. Attempting to start mongod..."
  systemctl enable --now mongod || {
    echo "ERROR: Could not start mongod. Install/enable mongod and re-run script."
    exit 1
  }
fi

# 3) Clone or update repository in /root
echo
echo "3) Cloning/updating repository into ${APP_DIR}..."
if [ -d "${APP_DIR}/.git" ]; then
  echo "-> Repo exists. Pulling latest changes..."
  cd "${APP_DIR}"
  git fetch --all
  git reset --hard origin/HEAD
else
  echo "-> Cloning repo..."
  rm -rf "${APP_DIR}"
  git clone "${REPO}" "${APP_DIR}"
fi

# 4) Install server (backend) dependencies
echo
echo "4) Installing backend dependencies..."
if [ -d "${BACKEND_DIR}" ]; then
  cd "${BACKEND_DIR}"
  npm install --production || { echo "ERROR: npm install (server) failed"; exit 1; }
else
  echo "ERROR: backend directory ${BACKEND_DIR} not found"; exit 1
fi

# 5) Install client deps and build React frontend
echo
echo "5) Building React frontend..."
if [ -d "${CLIENT_DIR}" ]; then
  cd "${CLIENT_DIR}"
  npm install || { echo "ERROR: npm install (client) failed"; exit 1; }
  npm run build || { echo "ERROR: npm run build failed"; exit 1; }
else
  echo "ERROR: client directory ${CLIENT_DIR} not found"; exit 1
fi

# 6) Copy build to BUILD_COPY_DIR (so nginx can serve without /root traversal issues)
echo
echo "6) Copying build to ${BUILD_COPY_DIR} and setting permissions..."
rm -rf "${BUILD_COPY_DIR}"
mkdir -p "${BUILD_COPY_DIR}"
cp -a "${CLIENT_DIR}/build/." "${BUILD_COPY_DIR}/"
chown -R www-data:www-data "${BUILD_COPY_DIR}"
chmod -R 755 "${BUILD_COPY_DIR}"

# 7) Ensure .env for server exists; create if missing
echo
echo "7) Ensuring server .env exists..."
ENV_FILE="${BACKEND_DIR}/.env"
if [ ! -f "${ENV_FILE}" ]; then
  cat > "${ENV_FILE}" <<EOF
PORT=${BACKEND_PORT}
MONGO_URI=${MONGO_URI}
JWT_SECRET=change_this_secret
NODE_ENV=production
EOF
  chmod 600 "${ENV_FILE}"
  echo "-> Created .env at ${ENV_FILE} (edit if you need to change secrets)."
else
  echo "-> .env already exists at ${ENV_FILE} (not overwriting)."
fi

# 8) Start backend via pm2
echo
echo "8) Starting backend with pm2 (name: ${PM2_APP_NAME})..."
cd "${BACKEND_DIR}"
# Start using package.json "start" script if present, otherwise try main file (index.js/server.js)
if grep -q "\"start\"" package.json 2>/dev/null; then
  pm2 start npm --name "${PM2_APP_NAME}" -- start --cwd "${BACKEND_DIR}"
else
  # try common entry names
  if [ -f "${BACKEND_DIR}/index.js" ]; then
    pm2 start index.js --name "${PM2_APP_NAME}" --cwd "${BACKEND_DIR}"
  elif [ -f "${BACKEND_DIR}/server.js" ]; then
    pm2 start server.js --name "${PM2_APP_NAME}" --cwd "${BACKEND_DIR}"
  else
    echo "ERROR: Couldn't determine backend entrypoint (no start script and no index.js/server.js)."
    exit 1
  fi
fi

pm2 save
pm2 startup -u root --hp /root >/dev/null || true

# Wait a couple of seconds and probe backend
sleep 2
echo "-> Probing backend at http://127.0.0.1:${BACKEND_PORT}"
if curl -sS --max-time 5 "http://127.0.0.1:${BACKEND_PORT}/" >/dev/null 2>&1; then
  echo "-> Backend responded (OK)."
else
  echo "WARNING: backend did not respond at http://127.0.0.1:${BACKEND_PORT}. Check pm2 logs: pm2 logs ${PM2_APP_NAME}"
fi

# 9) Configure Nginx site
echo
echo "9) Deploying nginx site for ${DOMAIN}..."
NGINX_SITE="/etc/nginx/sites-available/${DOMAIN}"
cat > "${NGINX_SITE}" <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    root ${BUILD_COPY_DIR};
    index index.html;

    # Serve static files, otherwise fallback to index.html (SPA routing)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy /api requests to Node backend
    location /api/ {
        proxy_pass http://127.0.0.1:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    client_max_body_size 50M;

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log  /var/log/nginx/${DOMAIN}.error.log;
}
EOF

# Enable site (replace any broken symlink)
ln -sf "${NGINX_SITE}" "/etc/nginx/sites-enabled/${DOMAIN}"

# Test nginx config and reload
echo "-> Testing nginx configuration..."
nginx -t

echo "-> Reloading nginx..."
systemctl reload nginx

# 10) Try to obtain TLS certificate (optional; requires DNS to be pointed to this VPS)
echo
echo "10) Obtaining TLS certificate with certbot (Let's Encrypt)..."
if ! command -v certbot >/dev/null 2>&1; then
  apt install -y certbot python3-certbot-nginx
fi

if host "${DOMAIN}" >/dev/null 2>&1 || true; then
  echo "-> Attempting certbot (non-interactive). If DNS is not pointed, this will fail."
  if certbot --nginx -d "${DOMAIN}" -d "www.${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}"; then
    echo "-> Certificate obtained and nginx updated."
  else
    echo "-> certbot failed (DNS may not be pointed or ports blocked). You can run certbot manually later."
  fi
else
  echo "-> Skipping certbot: DNS may not be resolvable for ${DOMAIN}."
fi

# 11) Final status summary
echo
echo "=== Deployment completed at $(date) ==="
echo "Frontend served from: ${BUILD_COPY_DIR}"
echo "Backend pm2 app name: ${PM2_APP_NAME} (port ${BACKEND_PORT})"
echo
echo "Useful commands:"
echo "  pm2 ls"
echo "  pm2 logs ${PM2_APP_NAME} --lines 200"
echo "  tail -f /var/log/nginx/${DOMAIN}.error.log"
echo "  tail -f /var/log/nginx/${DOMAIN}.access.log"
echo
echo "If you need me to adjust the nginx server block (for a different static path or subdomains), tell me the change."
