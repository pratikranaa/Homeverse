#!/bin/bash
set -e

# Update Launch Template Script for Strapi Backend
# Updates the EC2 Launch Template with a new AMI
#
# Usage:
#   ./scripts/update-launch-template.sh [AMI_ID]
#
# Arguments:
#   AMI_ID          AMI ID to use (optional, reads from /tmp/strapi-ami-id.txt if not provided)
#
# Environment Variables:
#   LAUNCH_TEMPLATE_ID    Launch Template ID (required)
#   AWS_REGION            AWS region (default: us-east-1)

echo "=========================================="
echo "Updating Launch Template"
echo "=========================================="

AWS_REGION="${AWS_REGION:-us-east-1}"

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

# Validate LAUNCH_TEMPLATE_ID
if [ -z "$LAUNCH_TEMPLATE_ID" ]; then
    error_exit "LAUNCH_TEMPLATE_ID environment variable is required"
fi

# Get AMI ID from argument or file
AMI_ID="$1"
if [ -z "$AMI_ID" ]; then
    if [ -f "/tmp/strapi-ami-id.txt" ]; then
        AMI_ID=$(cat /tmp/strapi-ami-id.txt)
        log_info "Using AMI ID from /tmp/strapi-ami-id.txt: $AMI_ID"
    else
        error_exit "AMI_ID not provided and /tmp/strapi-ami-id.txt not found"
    fi
fi

log_info "Launch Template ID: $LAUNCH_TEMPLATE_ID"
log_info "AMI ID: $AMI_ID"
log_info "AWS Region: $AWS_REGION"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    error_exit "AWS CLI is not installed"
fi

# Create new launch template version
log_step "Creating new launch template version..."
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
log_step "Setting version $NEW_VERSION as default..."
aws ec2 modify-launch-template \
    --launch-template-id "$LAUNCH_TEMPLATE_ID" \
    --default-version '$Latest' \
    --region "$AWS_REGION" || error_exit "Failed to set default launch template version"

log_info "Launch Template updated successfully"

echo ""
log_info "Update Summary:"
log_info "  - Launch Template: $LAUNCH_TEMPLATE_ID"
log_info "  - New Version: $NEW_VERSION (now default)"
log_info "  - AMI: $AMI_ID"
echo ""
