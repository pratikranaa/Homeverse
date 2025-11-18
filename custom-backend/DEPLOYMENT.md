# Custom Backend Deployment Guide

This document describes how to deploy the Custom Backend application to AWS.

## Overview

The deployment script (`deploy.sh`) automates the following tasks:
1. **Build Application** - Install dependencies and prepare the application
2. **Run Database Migrations** - Apply database schema changes
3. **Create AMI** - Create an Amazon Machine Image with the application code
4. **Update Launch Template** - Update the EC2 Launch Template with the new AMI
5. **Trigger Auto Scaling Refresh** - Roll out the new AMI to the Auto Scaling Group

## Prerequisites

### Required Tools
- Node.js 18+ LTS
- npm
- AWS CLI (for AMI creation)
- PostgreSQL client (for database operations)

### Required Environment Variables

```bash
# Database Configuration (Required)
DATABASE_URL=postgresql://user:password@host:5432/database

# AWS Configuration (Required for AMI creation)
AWS_REGION=us-east-1
LAUNCH_TEMPLATE_ID=lt-xxxxxxxxxxxxx
AUTO_SCALING_GROUP_NAME=custom-backend-asg

# Application Configuration (Optional)
ENVIRONMENT=production          # Default: production
NODE_ENV=production            # Default: production
```

### AWS IAM Permissions

The deployment script requires the following AWS IAM permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:CreateImage",
        "ec2:CreateTags",
        "ec2:DescribeImages",
        "ec2:CreateLaunchTemplateVersion",
        "ec2:ModifyLaunchTemplate",
        "autoscaling:StartInstanceRefresh",
        "autoscaling:DescribeInstanceRefreshes"
      ],
      "Resource": "*"
    }
  ]
}
```

## Usage

### Basic Deployment (on EC2)

When running on an EC2 instance with proper IAM role:

```bash
cd custom-backend
./deploy.sh
```

### Local Testing

To test the build and migration steps locally without creating an AMI:

```bash
./deploy.sh --skip-ami
```

### Skip Auto Scaling Refresh

To create an AMI and update the launch template without triggering an instance refresh:

```bash
./deploy.sh --skip-refresh
```

### Help

Display usage information:

```bash
./deploy.sh --help
```

## Deployment Steps Explained

### Step 1: Build Application

The script installs all production dependencies using `npm ci --production`. This ensures a clean, reproducible build.

```bash
npm ci --production
```

### Step 2: Run Database Migrations

Database migrations are executed using the custom migration script:

```bash
npm run migrate
```

This applies any pending schema changes to the PostgreSQL database.

### Step 3: Verify Database Setup

The script verifies that all required tables exist and the database is properly configured:

```bash
npm run db:verify
```

### Step 4: Health Check

A connection test is performed to ensure the application can connect to the database:

```javascript
const sequelize = new Sequelize(process.env.DATABASE_URL);
await sequelize.authenticate();
```

### Step 5: Create AMI

An Amazon Machine Image is created from the current EC2 instance:

```bash
aws ec2 create-image \
  --instance-id $INSTANCE_ID \
  --name "custom-backend-production-20251116-120000" \
  --no-reboot
```

The script waits for the AMI to become available before proceeding.

### Step 6: Update Launch Template

A new version of the Launch Template is created with the new AMI:

```bash
aws ec2 create-launch-template-version \
  --launch-template-id $LAUNCH_TEMPLATE_ID \
  --launch-template-data '{"ImageId":"ami-xxxxx"}'
```

The new version is set as the default.

### Step 7: Trigger Auto Scaling Refresh

An instance refresh is initiated to roll out the new AMI:

```bash
aws autoscaling start-instance-refresh \
  --auto-scaling-group-name $AUTO_SCALING_GROUP_NAME \
  --preferences '{"MinHealthyPercentage":90,"InstanceWarmup":300}'
```

This ensures zero-downtime deployment by maintaining 90% healthy instances during the refresh.

## Monitoring Deployment

### Check Instance Refresh Status

```bash
aws autoscaling describe-instance-refreshes \
  --auto-scaling-group-name custom-backend-asg \
  --region us-east-1
```

### Check AMI Status

```bash
aws ec2 describe-images \
  --image-ids ami-xxxxx \
  --region us-east-1
```

### View Application Logs

```bash
# On EC2 instance
pm2 logs custom-backend

# Or check log files
tail -f logs/combined.log
tail -f logs/error.log
```

## Rollback Procedure

If issues are detected after deployment:

### 1. Identify Previous AMI

```bash
aws ec2 describe-images \
  --owners self \
  --filters "Name=tag:Application,Values=custom-backend" \
  --query 'Images | sort_by(@, &CreationDate) | [-2]' \
  --region us-east-1
```

### 2. Update Launch Template

```bash
aws ec2 create-launch-template-version \
  --launch-template-id $LAUNCH_TEMPLATE_ID \
  --source-version <previous-version> \
  --region us-east-1

aws ec2 modify-launch-template \
  --launch-template-id $LAUNCH_TEMPLATE_ID \
  --default-version '$Latest' \
  --region us-east-1
```

### 3. Trigger Instance Refresh

```bash
aws autoscaling start-instance-refresh \
  --auto-scaling-group-name custom-backend-asg \
  --region us-east-1
```

## Troubleshooting

### Database Connection Fails

**Error:** `Database connection failed`

**Solution:**
- Verify `DATABASE_URL` is correctly set
- Check database credentials
- Ensure database is accessible from the instance
- Verify security group rules allow PostgreSQL traffic (port 5432)

### Migration Fails

**Error:** `Database migrations failed`

**Solution:**
- Check migration files in `src/db/migrate.js`
- Verify database user has CREATE/ALTER permissions
- Review migration logs for specific errors
- Manually connect to database and check schema state

### AMI Creation Fails

**Error:** `Failed to create AMI`

**Solution:**
- Verify AWS CLI is installed and configured
- Check IAM role has `ec2:CreateImage` permission
- Ensure instance is in a valid state
- Check AWS service health in the region

### Instance Refresh Fails

**Error:** `Failed to start instance refresh`

**Solution:**
- Verify Auto Scaling Group exists
- Check IAM permissions for `autoscaling:StartInstanceRefresh`
- Ensure no other instance refresh is in progress
- Verify launch template is valid

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy Custom Backend

on:
  push:
    branches: [main]
    paths:
      - 'custom-backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to EC2
        run: |
          # SSH into EC2 instance and run deployment
          ssh -i ${{ secrets.EC2_KEY }} ec2-user@${{ secrets.EC2_HOST }} << 'EOF'
            cd /opt/custom-backend
            git pull origin main
            ./deploy.sh
          EOF
```

### AWS CodePipeline Integration

The deployment script can be integrated into AWS CodePipeline as a build step:

1. **Source Stage**: Pull code from GitHub/CodeCommit
2. **Build Stage**: Run `npm ci` and tests
3. **Deploy Stage**: Execute `deploy.sh` on EC2 instance
4. **Approval Stage**: Manual approval before production
5. **Production Stage**: Run `deploy.sh` on production instances

## Best Practices

1. **Always test in staging first** - Run deployment in staging environment before production
2. **Monitor during deployment** - Watch CloudWatch metrics and application logs
3. **Keep previous AMIs** - Retain at least 3 previous AMIs for quick rollback
4. **Use blue-green deployment** - For critical updates, consider blue-green deployment strategy
5. **Schedule deployments** - Deploy during low-traffic periods when possible
6. **Backup database** - Take database snapshot before running migrations
7. **Test rollback procedure** - Regularly test rollback to ensure it works

## Support

For issues or questions:
- Check application logs: `pm2 logs custom-backend`
- Review CloudWatch logs
- Check database logs in RDS console
- Contact DevOps team

## Related Documentation

- [Custom Backend README](./README.md)
- [Database Migration Guide](./src/db/README.md)
- [AWS Infrastructure Documentation](../docs/infrastructure.md)
