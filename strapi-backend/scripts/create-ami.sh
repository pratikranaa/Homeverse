#!/bin/bash
set -e

# Create AMI Script for Strapi Backend
# Creates an Amazon Machine Image from the current EC2 instance
#
# Usage:
#   ./scripts/create-ami.sh
#
# Environment Variables:
#   AWS_REGION      AWS region (default: us-east-1)
#   ENVIRONMENT     Environment name (default: production)

echo "=========================================="
echo "Creating AMI for Strapi Backend"
echo "=========================================="

APP_NAME="strapi-backend"
ENVIRONMENT="${ENVIRONMENT:-production}"
AWS_REGION="${AWS_REGION:-us-east-1}"

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

# Get instance ID
log_step "Detecting EC2 instance..."
INSTANCE_ID=""
if command -v ec2-metadata &> /dev/null; then
    INSTANCE_ID=$(ec2-metadata --instance-id 2>/dev/null | cut -d " " -f 2 || echo "")
fi

if [ -z "$INSTANCE_ID" ]; then
    error_exit "Not running on EC2 instance. Cannot create AMI."
fi

log_info "Instance ID: $INSTANCE_ID"
log_info "Environment: $ENVIRONMENT"
log_info "AWS Region: $AWS_REGION"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    error_exit "AWS CLI is not installed. Please install it to create AMI."
fi

# Create AMI
log_step "Creating AMI..."
AMI_NAME="${APP_NAME}-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
log_info "AMI Name: $AMI_NAME"

AMI_ID=$(aws ec2 create-image \
    --instance-id "$INSTANCE_ID" \
    --name "$AMI_NAME" \
    --description "Strapi Backend deployment for $ENVIRONMENT - $(date)" \
    --no-reboot \
    --region "$AWS_REGION" \
    --tag-specifications "ResourceType=image,Tags=[{Key=Name,Value=$AMI_NAME},{Key=Environment,Value=$ENVIRONMENT},{Key=Application,Value=$APP_NAME},{Key=CreatedAt,Value=$(date -Iseconds)}]" \
    --query 'ImageId' \
    --output text) || error_exit "Failed to create AMI"

log_info "AMI created: $AMI_ID"

# Wait for AMI to be available
log_step "Waiting for AMI to be available..."
log_warn "This may take several minutes..."
aws ec2 wait image-available \
    --image-ids "$AMI_ID" \
    --region "$AWS_REGION" || error_exit "AMI failed to become available"

log_info "AMI is now available: $AMI_ID"

# Output AMI ID to file for use by other scripts
echo "$AMI_ID" > /tmp/strapi-ami-id.txt

echo ""
log_info "AMI Creation Summary:"
log_info "  - AMI ID: $AMI_ID"
log_info "  - AMI Name: $AMI_NAME"
log_info "  - Region: $AWS_REGION"
log_info "  - Instance: $INSTANCE_ID"
echo ""
log_info "AMI ID saved to: /tmp/strapi-ami-id.txt"
echo ""
