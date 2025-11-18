#!/bin/bash
# Launch Template Update script for Custom Backend
# This script updates the Launch Template with a new AMI

set -e

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
LAUNCH_TEMPLATE_ID="${LAUNCH_TEMPLATE_ID}"
AMI_ID="${1}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Validate inputs
if [ -z "$LAUNCH_TEMPLATE_ID" ]; then
    log_error "LAUNCH_TEMPLATE_ID environment variable is required"
    exit 1
fi

if [ -z "$AMI_ID" ]; then
    log_error "AMI_ID is required as first argument"
    echo "Usage: $0 <AMI_ID>"
    exit 1
fi

log_info "Launch Template ID: $LAUNCH_TEMPLATE_ID"
log_info "New AMI ID: $AMI_ID"

# Create new launch template version
log_info "Creating new launch template version..."
NEW_VERSION=$(aws ec2 create-launch-template-version \
    --launch-template-id "$LAUNCH_TEMPLATE_ID" \
    --source-version '$Latest' \
    --launch-template-data "{\"ImageId\":\"$AMI_ID\"}" \
    --version-description "Deployment on $(date) - AMI: $AMI_ID" \
    --region "$AWS_REGION" \
    --query 'LaunchTemplateVersion.VersionNumber' \
    --output text)

if [ $? -ne 0 ]; then
    log_error "Failed to create launch template version"
    exit 1
fi

log_info "Created launch template version: $NEW_VERSION"

# Set new version as default
log_info "Setting version $NEW_VERSION as default..."
aws ec2 modify-launch-template \
    --launch-template-id "$LAUNCH_TEMPLATE_ID" \
    --default-version '$Latest' \
    --region "$AWS_REGION" > /dev/null

if [ $? -ne 0 ]; then
    log_error "Failed to set default launch template version"
    exit 1
fi

log_info "Launch Template updated successfully (version $NEW_VERSION is now default)"

# Output version number
echo "$NEW_VERSION"
