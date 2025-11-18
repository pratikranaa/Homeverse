# Strapi Backend Setup Guide

This guide will help you set up the Strapi backend for the blog CMS.

## Quick Setup Steps

### 1. Install Dependencies

```bash
cd strapi-backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` and update the following:

#### Database Configuration
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_blog
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=your_secure_password
DATABASE_URL=postgresql://strapi_user:your_secure_password@localhost:5432/strapi_blog
```

#### AWS S3 Configuration
```env
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
AWS_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_BUCKET_PREFIX=uploads
```

### 3. Set Up PostgreSQL Database

#### Option A: Using psql command line

```bash
# Create database
createdb strapi_blog

# Create user and grant permissions
psql -d strapi_blog -c "CREATE USER strapi_user WITH PASSWORD 'your_secure_password';"
psql -d strapi_blog -c "GRANT ALL PRIVILEGES ON DATABASE strapi_blog TO strapi_user;"
psql -d strapi_blog -c "GRANT ALL ON SCHEMA public TO strapi_user;"
```

#### Option B: Using PostgreSQL GUI (pgAdmin, DBeaver, etc.)

1. Create a new database named `strapi_blog`
2. Create a new user `strapi_user` with password
3. Grant all privileges on the database to the user

### 4. Set Up AWS S3 Bucket

1. **Create S3 Bucket:**
   - Go to AWS S3 Console
   - Click "Create bucket"
   - Enter bucket name (e.g., `strapi-blog-media`)
   - Select region (e.g., `us-east-1`)
   - Uncheck "Block all public access" (we need public-read for images)
   - Create bucket

2. **Configure Bucket Policy:**
   - Go to bucket → Permissions → Bucket Policy
   - Add the following policy (replace `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

3. **Create IAM User:**
   - Go to IAM Console → Users → Add user
   - User name: `strapi-s3-user`
   - Access type: Programmatic access
   - Attach policy: Create custom policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name/*",
        "arn:aws:s3:::your-bucket-name"
      ]
    }
  ]
}
```

4. **Save Credentials:**
   - Copy Access Key ID and Secret Access Key
   - Add them to your `.env` file

### 5. Start Strapi

#### Development Mode (with auto-reload)

```bash
npm run develop
```

The admin panel will be available at: http://localhost:1337/admin

#### Production Mode

```bash
# Build the admin panel
npm run build

# Start the server
npm run start
```

### 6. Create Admin User

On first run:
1. Navigate to http://localhost:1337/admin
2. Fill in the admin registration form:
   - First name
   - Last name
   - Email
   - Password (minimum 8 characters)
3. Click "Let's start"

### 7. Verify Setup

#### Check Database Connection
- If Strapi starts without errors, database connection is successful
- Check logs for any database-related errors

#### Check S3 Upload
1. Go to admin panel → Media Library
2. Try uploading an image
3. Verify the image appears and has a public S3 URL

## Troubleshooting

### Database Connection Failed

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
- Ensure PostgreSQL is running: `sudo systemctl status postgresql`
- Start PostgreSQL: `sudo systemctl start postgresql`
- Check if port 5432 is open: `netstat -an | grep 5432`

### Permission Denied for Database

**Error:** `permission denied for schema public`

**Solution:**
```sql
GRANT ALL ON SCHEMA public TO strapi_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO strapi_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO strapi_user;
```

### S3 Upload Failed

**Error:** `Access Denied` or `InvalidAccessKeyId`

**Solution:**
- Verify AWS credentials in `.env` are correct
- Check IAM user has proper S3 permissions
- Verify bucket name and region are correct
- Ensure bucket policy allows public read access

### Port Already in Use

**Error:** `Port 1337 is already in use`

**Solution:**
- Change PORT in `.env` file to another port (e.g., 1338)
- Or kill the process using port 1337:
```bash
lsof -ti:1337 | xargs kill
```

## Next Steps

After successful setup:

1. **Configure Content Types** (Task 11 in implementation plan)
   - Create blog-post content type
   - Create blog-category content type
   - Create blog-author content type

2. **Configure API Endpoints** (Task 12 in implementation plan)
   - Enable public read access
   - Configure pagination
   - Set up filtering

3. **Test the Setup**
   - Create a test blog post
   - Upload a test image
   - Verify API endpoints work

## Production Deployment Notes

For production deployment on AWS EC2:

1. Use environment variables instead of `.env` file
2. Enable DATABASE_SSL=true for RDS connections
3. Use IAM roles instead of access keys when possible
4. Set up CloudFront CDN for S3 media
5. Configure proper CORS for your frontend domain
6. Use PM2 for process management
7. Set up monitoring and logging

## Security Checklist

- [ ] Strong database password set
- [ ] AWS credentials are not committed to git
- [ ] S3 bucket has proper access policies
- [ ] Admin user has strong password
- [ ] SSL/TLS enabled in production
- [ ] CORS configured for specific domains
- [ ] Rate limiting enabled
- [ ] Regular backups configured

## Support Resources

- Strapi Documentation: https://docs.strapi.io
- Strapi Discord: https://discord.strapi.io
- AWS S3 Documentation: https://docs.aws.amazon.com/s3/
- PostgreSQL Documentation: https://www.postgresql.org/docs/
