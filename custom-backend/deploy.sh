#!/bin/bash
set -e

# Custom Backend Deployment Script
# This script builds the application, runs migrations, creates an AMI, and triggers Auto Scaling refresh
# 
# Usage:
#   ./deploy.sh [OPTIONS]
#
# Options:
#   --skip-ami          Skip AMI creation (for local testing)
#   --skip-refresh      Skip Auto Scaling Group refresh
#   --help              Show this help message
#
# Required Environment Variables:
#   DATABASE_URL                Database connection string
#   AWS_REGION                  AWS region (default: us-east-1)
#   LAUNCH_TEMPLATE_ID          Launch Template ID for AMI update
#   AUTO_SCALING_GROUP_NAME     Auto Scaling Group name for refresh
#
# Optional Environment Variables:
#   ENVIRONMENT                 Environment name (default: production)
#   NODE_ENV                    Node environment (default: production)

echo "=========================================="
echo "Custom Backend Deployment Script"
echo "=========================================="

# Configuration
APP_NAME="custom-backend"
ENVIRONMENT="${ENVIRONMENT:-production}"
NODE_ENV="${NODE_ENV:-production}"
AWS_REGION="${AWS_REGION:-us-east-1}"
SKIP_AMI=false
SKIP_REFRESH=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-ami)
            SKIP_AMI=true
            shift
            ;;
        --skip-refresh)
            SKIP_REFRESH=true
            shift
            ;;
        --help)
            head -n 20 "$0" | grep "^#" | sed 's/^# //'
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Try to get instance ID (will be empty if not on EC2)
INSTANCE_ID=""
if command -v ec2-metadata &> /dev/null; then
    INSTANCE_ID=$(ec2-metadata --instance-id 2>/dev/null | cut -d " " -f 2 || echo "")
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Error handler
error_exit() {
    log_error "$1"
    exit 1
}

# Validate required environment variables
log_step "Validating environment configuration..."
if [ -z "$DATABASE_URL" ]; then
    error_exit "DATABASE_URL environment variable is required"
fi

if [ "$SKIP_AMI" = false ] && [ ! -z "$INSTANCE_ID" ]; then
    if [ -z "$LAUNCH_TEMPLATE_ID" ]; then
        log_warn "LAUNCH_TEMPLATE_ID not set, will skip launch template update"
    fi
    if [ -z "$AUTO_SCALING_GROUP_NAME" ]; then
        log_warn "AUTO_SCALING_GROUP_NAME not set, will skip Auto Scaling refresh"
    fi
fi

log_info "Environment: $ENVIRONMENT"
log_info "AWS Region: $AWS_REGION"
log_info "Instance ID: ${INSTANCE_ID:-'Not on EC2'}"

# Step 1: Build application
log_step "Step 1: Building application..."
log_info "Setting NODE_ENV to $NODE_ENV"
export NODE_ENV=$NODE_ENV

log_info "Installing dependencies..."
if [ "$NODE_ENV" = "production" ]; then
    npm ci --production || error_exit "Failed to install dependencies"
else
    npm ci || error_exit "Failed to install dependencies"
fi

log_info "Application built successfully"

# Step 2: Run database migrations
log_step "Step 2: Running database migrations..."
npm run migrate || error_exit "Database migrations failed"
log_info "Database migrations completed successfully"

# Step 3: Verify database setup
log_step "Step 3: Verifying database setup..."
npm run db:verify || error_exit "Database verification failed"
log_info "Database verification completed successfully"

# Step 4: Run health check
log_step "Step 4: Running application health check..."
node -e "
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
" || error_exit "Health check failed"

log_info "Health check passed"

# Step 5: Create AMI (if running on EC2)
if [ "$SKIP_AMI" = true ]; then
    log_warn "Skipping AMI creation (--skip-ami flag set)"
elif [ -z "$INSTANCE_ID" ]; then
    log_warn "Not running on EC2 instance, skipping AMI creation"
    log_info "To test locally, use: ./deploy.sh --skip-ami"
else
    log_step "Step 5: Creating AMI from instance $INSTANCE_ID..."
    
    # Check if AWS CLI is available
    if ! command -v aws &> /dev/null; then
        error_exit "AWS CLI is not installed. Please install it to create AMI."
    fi
    
    AMI_NAME="${APP_NAME}-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
    log_info "AMI Name: $AMI_NAME"
    
    AMI_ID=$(aws ec2 create-image \
        --instance-id "$INSTANCE_ID" \
        --name "$AMI_NAME" \
        --description "Custom Backend deployment for $ENVIRONMENT - $(date)" \
        --no-reboot \
        --region "$AWS_REGION" \
        --tag-specifications "ResourceType=image,Tags=[{Key=Name,Value=$AMI_NAME},{Key=Environment,Value=$ENVIRONMENT},{Key=Application,Value=$APP_NAME}]" \
        --query 'ImageId' \
        --output text) || error_exit "Failed to create AMI"
    
    log_info "AMI created: $AMI_ID"
    
    # Wait for AMI to be available
    log_info "Waiting for AMI to be available (this may take several minutes)..."
    aws ec2 wait image-available \
        --image-ids "$AMI_ID" \
        --region "$AWS_REGION" || error_exit "AMI failed to become available"
    
    log_info "AMI is now available: $AMI_ID"
    
    # Step 6: Update Launch Template
    if [ ! -z "$LAUNCH_TEMPLATE_ID" ]; then
        log_step "Step 6: Updating Launch Template $LAUNCH_TEMPLATE_ID..."
        
        NEW_VERSION=$(aws ec2 create-launch-template-version \
            --launch-template-id "$LAUNCH_TEMPLATE_ID" \
            --source-version '$Latest' \
            --launch-template-data "{\"ImageId\":\"$AMI_ID\"}" \
            --version-description "Deployment on $(date) - AMI: $AMI_ID" \
            --region "$AWS_REGION" \
            --query 'LaunchTemplateVersion.VersionNumber' \
            --output text) || error_exit "Failed to create launch template version"
        
        log_info "Created launch template version: $NEW_VERSION"
        
        # Set new version as default
        aws ec2 modify-launch-template \
            --launch-template-id "$LAUNCH_TEMPLATE_ID" \
            --default-version '$Latest' \
            --region "$AWS_REGION" || error_exit "Failed to set default launch template version"
        
        log_info "Launch Template updated successfully (version $NEW_VERSION is now default)"
    else
        log_warn "LAUNCH_TEMPLATE_ID not set, skipping launch template update"
    fi
    
    # Step 7: Trigger Auto Scaling Group refresh
    if [ "$SKIP_REFRESH" = true ]; then
        log_warn "Skipping Auto Scaling Group refresh (--skip-refresh flag set)"
    elif [ ! -z "$AUTO_SCALING_GROUP_NAME" ]; then
        log_step "Step 7: Triggering Auto Scaling Group refresh for $AUTO_SCALING_GROUP_NAME..."
        
        REFRESH_ID=$(aws autoscaling start-instance-refresh \
            --auto-scaling-group-name "$AUTO_SCALING_GROUP_NAME" \
            --preferences '{"MinHealthyPercentage":90,"InstanceWarmup":300,"CheckpointPercentages":[50,100],"CheckpointDelay":300}' \
            --region "$AWS_REGION" \
            --query 'InstanceRefreshId' \
            --output text) || error_exit "Failed to start instance refresh"
        
        log_info "Auto Scaling Group refresh initiated: $REFRESH_ID"
        log_info "Monitor progress with: aws autoscaling describe-instance-refreshes --auto-scaling-group-name $AUTO_SCALING_GROUP_NAME --region $AWS_REGION"
    else
        log_warn "AUTO_SCALING_GROUP_NAME not set, skipping Auto Scaling refresh"
    fi
fi

echo ""
echo "=========================================="
log_info "Deployment completed successfully!"
echo "=========================================="
echo ""
log_info "Summary:"
log_info "  - Application built: ✓"
log_info "  - Database migrated: ✓"
log_info "  - Health check passed: ✓"
if [ ! -z "$AMI_ID" ]; then
    log_info "  - AMI created: $AMI_ID"
fi
if [ ! -z "$NEW_VERSION" ]; then
    log_info "  - Launch Template version: $NEW_VERSION"
fi
if [ ! -z "$REFRESH_ID" ]; then
    log_info "  - Instance Refresh ID: $REFRESH_ID"
fi
echo ""
