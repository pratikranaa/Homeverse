# Strapi Backend Deployment Scripts

This directory contains deployment and utility scripts for the Strapi Backend.

## Main Deployment Script

### deploy.sh

The main deployment script that orchestrates the entire deployment process.

**Usage:**
```bash
./deploy.sh [OPTIONS]
```

**Options:**
- `--skip-ami` - Skip AMI creation (useful for local testing)
- `--skip-refresh` - Skip Auto Scaling Group refresh
- `--help` - Show help message

**Required Environment Variables:**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
AWS_REGION=us-east-1
LAUNCH_TEMPLATE_ID=lt-xxxxxxxxxxxxx
AUTO_SCALING_GROUP_NAME=strapi-backend-asg
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET=strapi-blog-media
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_token_salt
ADMIN_JWT_SECRET=your_admin_secret
TRANSFER_TOKEN_SALT=your_transfer_salt
JWT_SECRET=your_jwt_secret
```

**Example:**
```bash
# Full deployment on EC2
./deploy.sh

# Local testing (skip AMI creation)
./deploy.sh --skip-ami

# Create AMI but don't trigger refresh
./deploy.sh --skip-refresh
```

## Individual Scripts

These scripts can be run independently for specific tasks:

### build.sh

Builds the Strapi application for production.

**Usage:**
```bash
./scripts/build.sh
```

**Environment Variables:**
- `NODE_ENV` - Node environment (default: production)

**What it does:**
1. Installs dependencies
2. Builds Strapi admin panel

---

### migrate.sh

Verifies database connection. Strapi auto-migrates on startup.

**Usage:**
```bash
./scripts/migrate.sh
```

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (required)

**What it does:**
1. Verifies database connection
2. Confirms Strapi can connect to PostgreSQL

**Note:** Strapi automatically handles database schema migrations on startup, so no manual migration is needed.

---

### create-ami.sh

Creates an Amazon Machine Image from the current EC2 instance.

**Usage:**
```bash
./scripts/create-ami.sh
```

**Environment Variables:**
- `AWS_REGION` - AWS region (default: us-east-1)
- `ENVIRONMENT` - Environment name (default: production)

**What it does:**
1. Detects current EC2 instance ID
2. Creates AMI with proper tags
3. Waits for AMI to be available
4. Saves AMI ID to `/tmp/strapi-ami-id.txt`

**Requirements:**
- Must be run on an EC2 instance
- AWS CLI must be installed
- Instance must have IAM permissions to create AMIs

---

### update-launch-template.sh

Updates the EC2 Launch Template with a new AMI.

**Usage:**
```bash
./scripts/update-launch-template.sh [AMI_ID]
```

**Arguments:**
- `AMI_ID` - AMI ID to use (optional, reads from `/tmp/strapi-ami-id.txt` if not provided)

**Environment Variables:**
- `LAUNCH_TEMPLATE_ID` - Launch Template ID (required)
- `AWS_REGION` - AWS region (default: us-east-1)

**What it does:**
1. Creates new launch template version with specified AMI
2. Sets the new version as default

**Example:**
```bash
# Use AMI from create-ami.sh
./scripts/update-launch-template.sh

# Use specific AMI
./scripts/update-launch-template.sh ami-0123456789abcdef0
```

---

### trigger-asg-refresh.sh

Triggers an Auto Scaling Group instance refresh to deploy new AMI.

**Usage:**
```bash
./scripts/trigger-asg-refresh.sh
```

**Environment Variables:**
- `AUTO_SCALING_GROUP_NAME` - Auto Scaling Group name (required)
- `AWS_REGION` - AWS region (default: us-east-1)

**What it does:**
1. Initiates instance refresh with rolling deployment
2. Maintains 90% healthy instances during refresh
3. Uses checkpoints at 50% and 100%

**Refresh Configuration:**
- Min Healthy Percentage: 90%
- Instance Warmup: 300 seconds
- Checkpoints: 50%, 100%
- Checkpoint Delay: 300 seconds

---

### verify-s3-config.js

Verifies S3 configuration for media uploads.

**Usage:**
```bash
node scripts/verify-s3-config.js
```

**Environment Variables:**
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `AWS_BUCKET` - S3 bucket name

**What it does:**
1. Checks S3 bucket accessibility
2. Verifies AWS credentials
3. Tests bucket permissions

---

### test-upload-api.sh

Tests the Strapi upload API endpoint.

**Usage:**
```bash
./scripts/test-upload-api.sh
```

**What it does:**
1. Tests file upload to Strapi
2. Verifies S3 integration

---

## Deployment Workflow

### Standard Deployment

1. **Build Application:**
   ```bash
   ./scripts/build.sh
   ```

2. **Verify Database:**
   ```bash
   ./scripts/migrate.sh
   ```

3. **Create AMI:**
   ```bash
   ./scripts/create-ami.sh
   ```

4. **Update Launch Template:**
   ```bash
   ./scripts/update-launch-template.sh
   ```

5. **Trigger Instance Refresh:**
   ```bash
   ./scripts/trigger-asg-refresh.sh
   ```

### Quick Deployment

Use the main deployment script:
```bash
./deploy.sh
```

### Local Testing

Test the build without creating AMI:
```bash
./deploy.sh --skip-ami
```

## Monitoring Deployment

### Check Instance Refresh Status

```bash
aws autoscaling describe-instance-refreshes \
  --auto-scaling-group-name $AUTO_SCALING_GROUP_NAME \
  --region $AWS_REGION
```

### Check AMI Status

```bash
aws ec2 describe-images \
  --image-ids $AMI_ID \
  --region $AWS_REGION
```

### Check Launch Template

```bash
aws ec2 describe-launch-template-versions \
  --launch-template-id $LAUNCH_TEMPLATE_ID \
  --region $AWS_REGION
```

## Troubleshooting

### AMI Creation Fails

- Verify instance has IAM permissions for `ec2:CreateImage`
- Check if AWS CLI is installed: `aws --version`
- Verify AWS credentials are configured

### Launch Template Update Fails

- Verify `LAUNCH_TEMPLATE_ID` is correct
- Check IAM permissions for `ec2:CreateLaunchTemplateVersion`
- Ensure AMI exists in the same region

### Instance Refresh Fails

- Check Auto Scaling Group health checks
- Verify new instances can start successfully
- Review CloudWatch logs for errors
- Ensure minimum healthy percentage is achievable

### Database Connection Fails

- Verify `DATABASE_URL` is correct
- Check security group allows connection from EC2
- Verify RDS instance is running
- Test connection manually: `psql $DATABASE_URL`

### S3 Upload Fails

- Verify AWS credentials are correct
- Check S3 bucket exists and is accessible
- Verify IAM permissions for S3 operations
- Run: `node scripts/verify-s3-config.js`

## IAM Permissions Required

### For EC2 Instance Role

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
        "ec2:DescribeLaunchTemplateVersions",
        "autoscaling:StartInstanceRefresh",
        "autoscaling:DescribeInstanceRefreshes"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::strapi-blog-media",
        "arn:aws:s3:::strapi-blog-media/*"
      ]
    }
  ]
}
```

## Environment Setup

Create a `.env` file in the `strapi-backend` directory:

```bash
# Copy from example
cp .env.example .env

# Edit with your values
nano .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `AWS_BUCKET` - S3 bucket name
- `APP_KEYS` - Strapi app keys (comma-separated)
- `API_TOKEN_SALT` - Strapi API token salt
- `ADMIN_JWT_SECRET` - Strapi admin JWT secret
- `TRANSFER_TOKEN_SALT` - Strapi transfer token salt
- `JWT_SECRET` - Strapi JWT secret

## Notes

- Strapi automatically handles database migrations on startup
- AMI creation uses `--no-reboot` to avoid downtime
- Instance refresh maintains 90% healthy instances for zero-downtime deployment
- All scripts include colored output for better readability
- Scripts are idempotent and can be safely re-run
