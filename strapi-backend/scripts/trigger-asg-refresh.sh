#!/bin/bash
set -e

# Trigger Auto Scaling Group Refresh Script for Strapi Backend
# Initiates an instance refresh to deploy new AMI to all instances
#
# Usage:
#   ./scripts/trigger-asg-refresh.sh
#
# Environment Variables:
#   AUTO_SCALING_GROUP_NAME    Auto Scaling Group name (required)
#   AWS_REGION                 AWS region (default: us-east-1)

echo "=========================================="
echo "Triggering Auto Scaling Group Refresh"
echo "=========================================="

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

# Validate AUTO_SCALING_GROUP_NAME
if [ -z "$AUTO_SCALING_GROUP_NAME" ]; then
    error_exit "AUTO_SCALING_GROUP_NAME environment variable is required"
fi

log_info "Auto Scaling Group: $AUTO_SCALING_GROUP_NAME"
log_info "AWS Region: $AWS_REGION"

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    error_exit "AWS CLI is not installed"
fi

# Start instance refresh
log_step "Starting instance refresh..."
REFRESH_ID=$(aws autoscaling start-instance-refresh \
    --auto-scaling-group-name "$AUTO_SCALING_GROUP_NAME" \
    --preferences '{"MinHealthyPercentage":90,"InstanceWarmup":300,"CheckpointPercentages":[50,100],"CheckpointDelay":300}' \
    --region "$AWS_REGION" \
    --query 'InstanceRefreshId' \
    --output text) || error_exit "Failed to start instance refresh"

log_info "Instance refresh initiated: $REFRESH_ID"

echo ""
log_info "Refresh Configuration:"
log_info "  - Min Healthy Percentage: 90%"
log_info "  - Instance Warmup: 300 seconds"
log_info "  - Checkpoints: 50%, 100%"
log_info "  - Checkpoint Delay: 300 seconds"
echo ""
log_warn "The refresh will gradually replace instances to maintain availability"
log_info "Monitor progress with:"
echo "  aws autoscaling describe-instance-refreshes \\"
echo "    --auto-scaling-group-name $AUTO_SCALING_GROUP_NAME \\"
echo "    --region $AWS_REGION"
echo ""
log_info "Or check the AWS Console:"
echo "  https://console.aws.amazon.com/ec2/autoscaling/home?region=$AWS_REGION#AutoScalingGroups:"
echo ""
