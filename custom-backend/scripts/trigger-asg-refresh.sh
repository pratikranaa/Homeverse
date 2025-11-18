#!/bin/bash
# Auto Scaling Group Refresh script for Custom Backend
# This script triggers an instance refresh for the Auto Scaling Group

set -e

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
AUTO_SCALING_GROUP_NAME="${AUTO_SCALING_GROUP_NAME}"
MIN_HEALTHY_PERCENTAGE="${MIN_HEALTHY_PERCENTAGE:-90}"
INSTANCE_WARMUP="${INSTANCE_WARMUP:-300}"

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
if [ -z "$AUTO_SCALING_GROUP_NAME" ]; then
    log_error "AUTO_SCALING_GROUP_NAME environment variable is required"
    exit 1
fi

log_info "Auto Scaling Group: $AUTO_SCALING_GROUP_NAME"
log_info "Min Healthy Percentage: $MIN_HEALTHY_PERCENTAGE%"
log_info "Instance Warmup: ${INSTANCE_WARMUP}s"

# Check if there's already an instance refresh in progress
log_info "Checking for existing instance refreshes..."
EXISTING_REFRESH=$(aws autoscaling describe-instance-refreshes \
    --auto-scaling-group-name "$AUTO_SCALING_GROUP_NAME" \
    --region "$AWS_REGION" \
    --query 'InstanceRefreshes[?Status==`InProgress` || Status==`Pending`] | [0].InstanceRefreshId' \
    --output text 2>/dev/null || echo "None")

if [ "$EXISTING_REFRESH" != "None" ] && [ ! -z "$EXISTING_REFRESH" ]; then
    log_warn "Instance refresh already in progress: $EXISTING_REFRESH"
    log_warn "Cancelling existing refresh before starting new one..."
    
    aws autoscaling cancel-instance-refresh \
        --auto-scaling-group-name "$AUTO_SCALING_GROUP_NAME" \
        --region "$AWS_REGION" > /dev/null || log_warn "Failed to cancel existing refresh"
    
    # Wait a bit for cancellation to complete
    sleep 5
fi

# Start instance refresh
log_info "Starting instance refresh..."
REFRESH_ID=$(aws autoscaling start-instance-refresh \
    --auto-scaling-group-name "$AUTO_SCALING_GROUP_NAME" \
    --preferences "{\"MinHealthyPercentage\":$MIN_HEALTHY_PERCENTAGE,\"InstanceWarmup\":$INSTANCE_WARMUP,\"CheckpointPercentages\":[50,100],\"CheckpointDelay\":300}" \
    --region "$AWS_REGION" \
    --query 'InstanceRefreshId' \
    --output text)

if [ $? -ne 0 ]; then
    log_error "Failed to start instance refresh"
    exit 1
fi

log_info "Instance refresh started: $REFRESH_ID"
log_info ""
log_info "Monitor progress with:"
log_info "  aws autoscaling describe-instance-refreshes \\"
log_info "    --auto-scaling-group-name $AUTO_SCALING_GROUP_NAME \\"
log_info "    --region $AWS_REGION"

# Output refresh ID
echo "$REFRESH_ID"
