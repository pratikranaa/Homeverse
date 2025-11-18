#!/bin/bash
set -e

# Strapi Migration Script
# Verifies database connection and prepares for Strapi auto-migration
#
# Note: Strapi automatically handles database migrations on startup.
# This script verifies the database connection is working.
#
# Usage:
#   ./scripts/migrate.sh
#
# Environment Variables:
#   DATABASE_URL    PostgreSQL connection string (required)

echo "=========================================="
echo "Strapi Database Migration"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

error_exit() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Validate DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    error_exit "DATABASE_URL environment variable is required"
fi

log_info "Database URL: ${DATABASE_URL%%@*}@***" # Hide credentials in log

# Verify database connection
log_step "Verifying database connection..."
node -e "
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log('✓ Database connection successful');
    return sequelize.close();
  })
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
    process.exit(1);
  });
" || error_exit "Database connection verification failed"

log_info "Database connection verified successfully"
log_warn "Strapi will automatically migrate the database schema on first start"
log_info "No manual migration required"
echo ""
