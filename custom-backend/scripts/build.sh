#!/bin/bash
# Build script for Custom Backend
# This script is called by deploy.sh but can also be run standalone

set -e

echo "Building Custom Backend application..."

# Set NODE_ENV if not already set
export NODE_ENV="${NODE_ENV:-production}"

echo "NODE_ENV: $NODE_ENV"

# Install dependencies
if [ "$NODE_ENV" = "production" ]; then
    echo "Installing production dependencies..."
    npm ci --production
else
    echo "Installing all dependencies..."
    npm ci
fi

echo "Build completed successfully!"
