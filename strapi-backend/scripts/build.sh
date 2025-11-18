#!/bin/bash
set -e

# Strapi Build Script
# Builds the Strapi application for production deployment
#
# Usage:
#   ./scripts/build.sh
#
# Environment Variables:
#   NODE_ENV    Node environment (default: production)

echo "=========================================="
echo "Building Strapi Application"
echo "=========================================="

NODE_ENV="${NODE_ENV:-production}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

error_exit() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

log_info "Node Environment: $NODE_ENV"

# Install dependencies
log_step "Installing dependencies..."
if [ "$NODE_ENV" = "production" ]; then
    npm ci --production || error_exit "Failed to install production dependencies"
else
    npm ci || error_exit "Failed to install dependencies"
fi

# Build Strapi admin panel
log_step "Building Strapi admin panel..."
npm run build || error_exit "Strapi build failed"

log_info "Build completed successfully!"
echo ""
