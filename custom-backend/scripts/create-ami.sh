#!/bin/bash
# AMI Creation script for Custom Backend
# This script creates an AMI from the current EC2 instance

set -e

# Configuration
APP_NAME="${APP_NAME:-custom-backend}"
ENVIRONMENT="${ENVIRONMENT:-production}"
AWS_REGION="${AWS_REGION:-us-east-1}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get instance ID
if command -v ec2-metadata &> /dev/null; then
    INSTANCE_ID=$(ec2-metadata --instance-id 2>/dev/null | cut -d " " -f 2 || echo "")
else
    log_error "ec2-metadata command not found. Are you running on EC2?"
    exit 1
fi

if [ -z "$INSTANCE_ID" ]; then
    log_error "Could not determine instance ID. Are you running on EC2?"
    exit 1
fi

log_info "Instance ID: $INSTANCE_ID"

# Create AMI
AMI_NAME="${APP_NAME}-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
log_info "Creating AMI: $AMI_NAME"

AMI_ID=$(aws ec2 create-image \
    --instance-id "$INSTANCE_ID" \
    --name "$AMI_NAME" \
    --description "Custom Backend deployment for $ENVIRONMENT - $(date)" \
    --no-reboot \
    --region "$AWS_REGION" \
    --tag-specifications "ResourceType=image,Tags=[{Key=Name,Value=$AMI_NAME},{Key=Environment,Value=$ENVIRONMENT},{Key=Application,Value=$APP_NAME},{Key=CreatedBy,Value=deployment-script}]" \
    --query 'ImageId' \
    --output text)

if [ $? -ne 0 ]; then
    log_error "Failed to create AMI"
    exit 1
fi

log_info "AMI created: $AMI_ID"

# Wait for AMI to be available
log_info "Waiting for AMI to be available..."
aws ec2 wait image-available \
    --image-ids "$AMI_ID" \
    --region "$AWS_REGION"

if [ $? -ne 0 ]; then
    log_error "AMI failed to become available"
    exit 1
fi

log_info "AMI is now available: $AMI_ID"

# Output AMI ID for use in other scripts
echo "$AMI_ID"
