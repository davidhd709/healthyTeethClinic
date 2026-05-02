#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/home/ingenierohenry/healthyTeethClinic"
BRANCH="main"

cd "$APP_DIR"

echo "Fetching latest changes..."
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "Installing backend dependencies..."
npm ci --prefix backend

echo "Building backend..."
npm run build --prefix backend

echo "Installing frontend dependencies..."
npm ci --prefix frontend

echo "Building frontend..."
npm run build --prefix frontend

echo "Restarting services..."
sudo systemctl restart healthyteeth-backend.service
sudo systemctl restart healthyteeth-frontend.service

echo "Checking service status..."
systemctl is-active --quiet healthyteeth-backend.service
systemctl is-active --quiet healthyteeth-frontend.service

echo "Deployment completed."
