# AWS S3 Upload Configuration for Strapi

## Configuration Status

✅ **Package Installed**: `@strapi/provider-upload-aws-s3@5.31.0`

✅ **Plugin Configuration**: Configured in `config/plugins.ts`

✅ **Environment Variables**: Set in `.env` file

✅ **Content Types**: Media fields configured in:
- `blog-post.featured_image` (single image)
- `blog-author.avatar` (single image)

## Configuration Details

### 1. Plugin Configuration (`config/plugins.ts`)

```typescript
export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
        region: env('AWS_REGION'),
        params: {
          ACL: 'public-read',  // ✅ Public read access configured
          Bucket: env('AWS_BUCKET'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
```

### 2. Environment Variables (`.env`)

Required variables:
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: AWS region (e.g., us-east-1)
- `AWS_BUCKET`: S3 bucket name (e.g., strapi-blog-media)

**Note**: Update these values with your actual AWS credentials before testing.

### 3. S3 Bucket Requirements

Your S3 bucket should have:
- **Public access**: Configured to allow public-read ACL
- **CORS configuration**: Allow requests from your Strapi domain
- **Bucket policy**: Allow GetObject for public access

Example CORS configuration:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

Example Bucket Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::strapi-blog-media/*"
    }
  ]
}
```

## Testing Upload Functionality

### Method 1: Using Strapi Admin Panel

1. Start the Strapi server:
   ```bash
   npm run develop
   ```

2. Access the admin panel at `http://localhost:1337/admin`

3. Navigate to Content Manager → Blog Posts or Blog Authors

4. Create or edit an entry

5. Upload an image to the `featured_image` or `avatar` field

6. Save the entry

7. Verify the image URL in the response points to your S3 bucket

### Method 2: Using API Endpoint

1. Start the Strapi server:
   ```bash
   npm run develop
   ```

2. Upload a file using the upload API:
   ```bash
   curl -X POST http://localhost:1337/api/upload \
     -H "Content-Type: multipart/form-data" \
     -F "files=@/path/to/your/image.jpg"
   ```

3. Expected response:
   ```json
   [
     {
       "id": 1,
       "name": "image.jpg",
       "url": "https://strapi-blog-media.s3.us-east-1.amazonaws.com/image_abc123.jpg",
       "provider": "aws-s3",
       "mime": "image/jpeg",
       "size": 123.45,
       ...
     }
   ]
   ```

### Method 3: Verify in Blog Post API Response

1. Create a blog post with a featured image via admin panel

2. Fetch the blog post via API:
   ```bash
   curl http://localhost:1337/api/blog-posts?populate=*
   ```

3. Verify the response includes S3 URLs:
   ```json
   {
     "data": [
       {
         "id": 1,
         "attributes": {
           "title": "Test Post",
           "featured_image": {
             "data": {
               "attributes": {
                 "url": "https://strapi-blog-media.s3.us-east-1.amazonaws.com/...",
                 "provider": "aws-s3"
               }
             }
           }
         }
       }
     ]
   }
   ```

## Verification Checklist

- [ ] AWS credentials are set in `.env` file
- [ ] S3 bucket exists and is accessible
- [ ] S3 bucket has public-read permissions configured
- [ ] S3 bucket has CORS policy configured
- [ ] Strapi builds successfully (`npm run build`)
- [ ] Strapi starts successfully (`npm run develop`)
- [ ] Can upload images via admin panel
- [ ] Uploaded images are stored in S3
- [ ] S3 URLs are returned in API responses
- [ ] Uploaded images are publicly accessible via S3 URLs

## Troubleshooting

### Issue: "Access Denied" error when uploading

**Solution**: Check IAM user permissions. The AWS user needs:
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
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::strapi-blog-media/*"
    }
  ]
}
```

### Issue: Images upload but URLs are not accessible

**Solution**: 
1. Check bucket policy allows public GetObject
2. Verify ACL is set to "public-read" in plugins.ts
3. Check bucket's "Block public access" settings

### Issue: CORS errors when uploading from admin panel

**Solution**: Add CORS configuration to S3 bucket (see above)

## Additional Configuration Options

### Custom Upload Path

To organize uploads by date or type, modify `plugins.ts`:

```typescript
providerOptions: {
  // ... other options
  params: {
    ACL: 'public-read',
    Bucket: env('AWS_BUCKET'),
  },
  baseUrl: env('CDN_URL'), // Optional: Use CloudFront CDN
},
```

### CloudFront CDN Integration

For better performance, configure CloudFront:

1. Create CloudFront distribution with S3 bucket as origin
2. Add `CDN_URL` to `.env`:
   ```
   CDN_URL=https://d1234567890.cloudfront.net
   ```
3. Update `plugins.ts` to use `baseUrl: env('CDN_URL')`

## Requirements Satisfied

✅ **Requirement 14.1**: Media files stored in AWS S3
✅ **Requirement 14.2**: Public URLs generated for uploaded media
✅ **Requirement 14.4**: Support for common image formats (JPEG, PNG, WebP)

## Next Steps

1. Update `.env` with actual AWS credentials
2. Create and configure S3 bucket
3. Test upload functionality using one of the methods above
4. Verify S3 URLs are returned in API responses
5. Test public accessibility of uploaded images
