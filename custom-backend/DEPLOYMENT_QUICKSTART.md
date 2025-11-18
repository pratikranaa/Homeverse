# Deployment Quick Start Guide

Quick reference for deploying the Custom Backend to AWS.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] AWS CLI installed and configured
- [ ] Database accessible (PostgreSQL)
- [ ] Environment variables configured

## Environment Variables

Create a `.env` file or set these variables:

```bash
# Required
DATABASE_URL=postgresql://user:password@host:5432/database

# Required for AMI creation
AWS_REGION=us-east-1
LAUNCH_TEMPLATE_ID=lt-xxxxxxxxxxxxx
AUTO_SCALING_GROUP_NAME=custom-backend-asg

# Optional
ENVIRONMENT=production
NODE_ENV=production
```

## Deployment Commands

### Full Deployment (on EC2)

```bash
./deploy.sh
```

This will:
1. ✓ Build application
2. ✓ Run migrations
3. ✓ Create AMI
4. ✓ Update launch template
5. ✓ Trigger Auto Scaling refresh

### Local Testing

```bash
./deploy.sh --skip-ami
```

Tests build and migrations without creating AMI.

### Create AMI Only

```bash
npm run ami:create
```

### Update Launch Template Only

```bash
export AMI_ID=ami-xxxxx
npm run ami:update-template $AMI_ID
```

### Trigger ASG Refresh Only

```bash
npm run asg:refresh
```

## Monitoring

### Check Deployment Status

```bash
# Instance refresh status
aws autoscaling describe-instance-refreshes \
  --auto-scaling-group-name custom-backend-asg

# Application logs
pm2 logs custom-backend

# Health check
curl http://localhost:3000/health
```

### CloudWatch Logs

```bash
# View logs
aws logs tail /aws/ec2/custom-backend --follow

# Check errors
aws logs filter-pattern /aws/ec2/custom-backend --filter-pattern "ERROR"
```

## Rollback

If deployment fails:

```bash
# 1. Find previous AMI
aws ec2 describe-images \
  --owners self \
  --filters "Name=tag:Application,Values=custom-backend" \
  --query 'Images | sort_by(@, &CreationDate) | [-2].ImageId'

# 2. Update launch template with previous AMI
export AMI_ID=ami-previous
npm run ami:update-template $AMI_ID

# 3. Trigger refresh
npm run asg:refresh
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection fails | Check `DATABASE_URL` and security groups |
| Migration fails | Verify database permissions |
| AMI creation fails | Check IAM role has `ec2:CreateImage` |
| ASG refresh fails | Ensure no other refresh in progress |

## Support

- Full documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Database guide: [src/db/README.md](./src/db/README.md)
- Application logs: `pm2 logs custom-backend`

## Common Workflows

### Deploy to Staging

```bash
export ENVIRONMENT=staging
export AUTO_SCALING_GROUP_NAME=custom-backend-staging-asg
./deploy.sh
```

### Deploy to Production

```bash
export ENVIRONMENT=production
export AUTO_SCALING_GROUP_NAME=custom-backend-production-asg
./deploy.sh
```

### Emergency Rollback

```bash
# Get previous AMI
PREV_AMI=$(aws ec2 describe-images \
  --owners self \
  --filters "Name=tag:Application,Values=custom-backend" \
  --query 'Images | sort_by(@, &CreationDate) | [-2].ImageId' \
  --output text)

# Deploy previous AMI
export AMI_ID=$PREV_AMI
npm run ami:update-template $AMI_ID
npm run asg:refresh
```
