#!/bin/bash

# Test script for Strapi upload API
# This script tests the upload endpoint and verifies S3 URLs are returned

echo "🧪 Testing Strapi Upload API with S3 Provider"
echo "=============================================="
echo ""

# Check if Strapi is running
if ! curl -s http://localhost:1337/api > /dev/null 2>&1; then
    echo "❌ Strapi is not running on http://localhost:1337"
    echo "   Start Strapi with: npm run develop"
    exit 1
fi

echo "✅ Strapi is running"
echo ""

# Create a test image file
TEST_IMAGE="/tmp/test-upload.jpg"
if [ ! -f "$TEST_IMAGE" ]; then
    echo "📝 Creating test image..."
    # Create a simple 1x1 pixel JPEG (base64 encoded)
    echo "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=" | base64 -d > "$TEST_IMAGE"
fi

echo "📤 Testing upload endpoint..."
echo ""

# Test upload (this will fail without proper AWS credentials, but we can check the response format)
RESPONSE=$(curl -s -X POST http://localhost:1337/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "files=@$TEST_IMAGE" 2>&1)

echo "Response:"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if response contains S3 URL pattern
if echo "$RESPONSE" | grep -q "s3.*amazonaws.com"; then
    echo "✅ Response contains S3 URL"
    echo "✅ Upload provider is working correctly"
elif echo "$RESPONSE" | grep -q "error"; then
    echo "⚠️  Upload failed (expected if AWS credentials are not configured)"
    echo "   Configure AWS credentials in .env file to enable uploads"
else
    echo "ℹ️  Response format:"
    echo "$RESPONSE" | jq '.[] | {id, name, url, provider}' 2>/dev/null || echo "   Unable to parse response"
fi

echo ""
echo "=============================================="
echo "📋 To fully test S3 uploads:"
echo "   1. Configure AWS credentials in .env"
echo "   2. Ensure S3 bucket exists and is accessible"
echo "   3. Run this script again"
echo "   4. Or test via admin panel at http://localhost:1337/admin"
