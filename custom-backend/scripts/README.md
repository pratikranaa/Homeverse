# Deployment Scripts

This directory contains modular deployment scripts for the Custom Backend application.

## Scripts Overview

### `build.sh`
Builds the application by installing dependencies.

**Usage:**
```bash
./scripts/build.sh
```

**Environment Variables:**
- `NODE_ENV` - Node environment (default: production)

**What it does:**
- Installs npm dependencies
- Uses `npm ci --production` for production builds
- Uses `npm ci` for development builds

---

### `create-ami.sh`
Creates an Amazon Machine Image (AMI) from the current EC2 instance.

**Usage:**
```bash
./scripts/create-ami.sh
```

**Environment Variables:**
- `APP_NAME` - Application name (default: custom-backend)
- `ENVIRONMENT` - Environment name (default: production)
- `AWS_REGION` - AWS region (default: us-east-1)

**Requirements:**
- Must be run on an EC2 instance
- Requires `ec2-metadata` command
- Requires AWS CLI with proper IAM permissions

**Output:**
- Prints the AMI ID to stdout
- Tags AMI with Name, Environment, Application, CreatedBy

**What it does:**
1. Detects current EC2 instance ID
2. Creates AMI with timestamp-based name
3. Waits for AMI to become available
4. Returns AMI ID

---

### `update-launch-template.sh`
Updates an EC2 Launch Template with a new AMI.

**Usage:**
```bash
./scripts/update-launch-template.sh <AMI_ID>
```

**Arguments:**
- `AMI_ID` - The AMI ID to use in the launch template (required)

**Environment Variables:**
- `LAUNCH_TEMPLATE_ID` - Launch Template ID (required)
- `AWS_REGION` - AWS region (default: us-east-1)

**Requirements:**
- AWS CLI with proper IAM permissions
- Valid Launch Template ID

**Output:**
- Prints the new version number to stdout

**What it does:**
1. Creates new launch template version with specified AMI
2. Sets new version as default
3. Returns version number

---

### `trigger-asg-refresh.sh`
Triggers an instance refresh for an Auto Scaling Group.

**Usage:**
```bash
./scripts/trigger-asg-refresh.sh
```

**Environment Variables:**
- `AUTO_SCALING_GROUP_NAME` - ASG name (required)
- `AWS_REGION` - AWS region (default: us-east-1)
- `MIN_HEALTHY_PERCENTAGE` - Minimum healthy instances during refresh (default: 90)
- `INSTANCE_WARMUP` - Warmup time in seconds (default: 300)

**Requirements:**
- AWS CLI with proper IAM permissions
- Valid Auto Scaling Group

**Output:**
- Prints the instance refresh ID to stdout

**What it does:**
1. Checks for existing instance refreshes
2. Cancels any in-progress refresh
3. Starts new instance refresh with checkpoints
4. Returns refresh ID

---

## Usage Examples

### Complete Deployment Pipeline

```bash
# 1. Build application
./scripts/build.sh

# 2. Create AMI
AMI_ID=$(./scripts/create-ami.sh)
echo "Created AMI: $AMI_ID"

# 3. Update launch template
VERSION=$(./scripts/update-launch-template.sh $AMI_ID)
echo "Launch template version: $VERSION"

# 4. Trigger ASG refresh
REFRESH_ID=$(./scripts/trigger-asg-refresh.sh)
echo "Instance refresh: $REFRESH_ID"
```

### Create AMI and Update Template

```bash
AMI_ID=$(./scripts/create-ami.sh)
./scripts/update-launch-template.sh $AMI_ID
```

### Update Template with Existing AMI

```bash
export LAUNCH_TEMPLATE_ID=lt-xxxxx
./scripts/update-launch-template.sh ami-xxxxx
```

### Trigger Refresh with Custom Settings

```bash
export AUTO_SCALING_GROUP_NAME=custom-backend-asg
export MIN_HEALTHY_PERCENTAGE=80
export INSTANCE_WARMUP=600
./scripts/trigger-asg-refresh.sh
```

## Integration with Main Deployment Script

The main deployment script (`../deploy.sh`) orchestrates these scripts:

```bash
# Main deploy.sh calls these scripts in sequence:
1. build.sh (implicitly via npm ci)
2. Database migrations (via npm run migrate)
3. create-ami.sh
4. update-launch-template.sh
5. trigger-asg-refresh.sh
```

## Error Handling

All scripts:
- Use `set -e` to exit on errors
- Validate required inputs
- Provide colored output (green=info, yellow=warn, red=error)
- Return non-zero exit codes on failure

## IAM Permissions Required

### For `create-ami.sh`:
```json
{
  "Effect": "Allow",
  "Action": [
    "ec2:CreateImage",
    "ec2:CreateTags",
    "ec2:DescribeImages"
  ],
  "Resource": "*"
}
```

### For `update-launch-template.sh`:
```json
{
  "Effect": "Allow",
  "Action": [
    "ec2:CreateLaunchTemplateVersion",
    "ec2:ModifyLaunchTemplate",
    "ec2:DescribeLaunchTemplates"
  ],
  "Resource": "*"
}
```

### For `trigger-asg-refresh.sh`:
```json
{
  "Effect": "Allow",
  "Action": [
    "autoscaling:StartInstanceRefresh",
    "autoscaling:CancelInstanceRefresh",
    "autoscaling:DescribeInstanceRefreshes"
  ],
  "Resource": "*"
}
```

## Testing

### Test Script Syntax

```bash
# Check all scripts for syntax errors
for script in *.sh; do
  bash -n "$script" && echo "$script: OK"
done
```

### Test Locally (Dry Run)

Most scripts require EC2/AWS resources, but you can test the logic:

```bash
# Test build script
./build.sh

# Test other scripts (will fail gracefully if not on EC2)
./create-ami.sh || echo "Expected to fail outside EC2"
```

## Troubleshooting

### Script Not Executable

```bash
chmod +x scripts/*.sh
```

### AWS CLI Not Found

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### ec2-metadata Not Found

```bash
# Install ec2-metadata (usually pre-installed on Amazon Linux)
sudo yum install -y ec2-instance-connect
```

### Permission Denied

Ensure the IAM role attached to the EC2 instance has the required permissions.

## Related Documentation

- [Main Deployment Guide](../DEPLOYMENT.md)
- [Quick Start Guide](../DEPLOYMENT_QUICKSTART.md)
- [Database Migration Guide](../src/db/README.md)
