# Strapi Backend - Blog CMS

This is the Strapi backend service for managing blog content only. It is part of a dual-backend architecture where the Custom Backend handles business logic and non-blog content.

## Features

- Blog post management (CRUD operations)
- Blog categories
- Blog authors
- Media upload to AWS S3
- PostgreSQL database
- RESTful API for blog content

## Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15+
- AWS S3 bucket for media storage
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Update AWS S3 credentials

## Environment Variables

### Server Configuration
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 1337)

### Security Secrets
- `APP_KEYS`: Application keys for session encryption
- `API_TOKEN_SALT`: Salt for API token generation
- `ADMIN_JWT_SECRET`: Secret for admin JWT tokens
- `TRANSFER_TOKEN_SALT`: Salt for transfer tokens
- `ENCRYPTION_KEY`: Encryption key for sensitive data

### Database Configuration (PostgreSQL)
- `DATABASE_CLIENT`: Database client (postgres)
- `DATABASE_HOST`: PostgreSQL host
- `DATABASE_PORT`: PostgreSQL port (default: 5432)
- `DATABASE_NAME`: Database name
- `DATABASE_USERNAME`: Database user
- `DATABASE_PASSWORD`: Database password
- `DATABASE_SSL`: Enable SSL connection (true/false)
- `DATABASE_URL`: Full PostgreSQL connection string

### AWS S3 Configuration
- `AWS_ACCESS_KEY_ID`: AWS access key ID
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `AWS_REGION`: AWS region (e.g., us-east-1)
- `AWS_BUCKET`: S3 bucket name for media storage
- `AWS_BUCKET_PREFIX`: Prefix for uploaded files (e.g., uploads)

## Database Setup

1. Create PostgreSQL database:
```bash
createdb strapi_blog
```

2. Create database user:
```sql
CREATE USER strapi_user WITH PASSWORD 'strapi_password';
GRANT ALL PRIVILEGES ON DATABASE strapi_blog TO strapi_user;
```

3. Run migrations (automatic on first start):
```bash
npm run develop
```

## AWS S3 Setup

1. Create an S3 bucket in AWS Console
2. Configure bucket permissions for public-read access
3. Create IAM user with S3 access permissions
4. Add credentials to `.env` file

Required IAM permissions:
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

## Running the Application

### Development Mode
```bash
npm run develop
```
Access admin panel at: http://localhost:1337/admin

### Production Mode
```bash
npm run build
npm run start
```

## Admin Panel Setup

On first run, you'll be prompted to create an admin user:
1. Navigate to http://localhost:1337/admin
2. Fill in admin user details
3. Complete registration

## API Endpoints

### Blog Posts
- `GET /api/blogs` - List all blog posts
- `GET /api/blogs/:slug` - Get blog post by slug
- `POST /api/blogs` - Create blog post (admin only)
- `PUT /api/blogs/:id` - Update blog post (admin only)
- `DELETE /api/blogs/:id` - Delete blog post (admin only)

### Blog Categories
- `GET /api/blog-categories` - List all categories
- `GET /api/blog-categories/:id` - Get category by ID

### Blog Authors
- `GET /api/blog-authors` - List all authors
- `GET /api/blog-authors/:id` - Get author by ID

## Content Types

### Blog Post
- title (string)
- slug (uid)
- content (richtext)
- excerpt (text)
- featured_image (media)
- seo_title (string)
- seo_description (text)
- published_at (datetime)
- category (relation)
- author (relation)

### Blog Category
- name (string)
- slug (uid)
- description (text)

### Blog Author
- name (string)
- bio (text)
- avatar (media)
- social_links (json)

## Deployment

### AWS EC2 Deployment
1. Build the application:
```bash
npm run build
```

2. Set environment variables on EC2 instance

3. Use PM2 for process management:
```bash
pm2 start npm --name "strapi-backend" -- start
pm2 save
pm2 startup
```

### Health Check
- Endpoint: `/_health`
- Use for ALB health checks

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists and user has permissions

### S3 Upload Issues
- Verify AWS credentials are correct
- Check S3 bucket permissions
- Ensure bucket exists in specified region

### Port Already in Use
- Change PORT in `.env` file
- Kill process using port: `lsof -ti:1337 | xargs kill`

## Security Notes

- Never commit `.env` file to version control
- Use strong passwords for database and admin users
- Rotate API keys and secrets regularly
- Enable SSL in production
- Configure CORS properly for frontend domain
- Use AWS IAM roles instead of access keys when possible

## Support

For Strapi documentation: https://docs.strapi.io
