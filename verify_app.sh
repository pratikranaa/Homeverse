#!/bin/bash

echo "Verifying Application Services..."

# 1. Check Health
echo "--------------------------------------------------"
echo "Checking Service Health..."

# Custom Backend
echo -n "Custom Backend (http://localhost:3001/health): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health
echo ""

# Strapi Backend (Admin Panel)
echo -n "Strapi Backend (http://localhost:1337/admin): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/admin
echo ""

# Frontend
echo -n "Frontend (http://localhost:3002): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:3002
echo ""

# 2. Check Custom Backend Content
echo "--------------------------------------------------"
echo "Checking Custom Backend Content Routes..."

echo "GET /api/v1/content/home:"
curl -s http://localhost:3001/api/v1/content/home | head -c 200
echo "..."
echo ""

echo "GET /api/v1/content/about:"
curl -s http://localhost:3001/api/v1/content/about | head -c 200
echo "..."
echo ""

# 3. Check Strapi Content (Public)
echo "--------------------------------------------------"
echo "Checking Strapi Content (Public)..."

# Note: By default Strapi endpoints might be 403 Forbidden if not made public.
# We are checking if the endpoint is reachable (even if 403).
echo -n "GET /api/blog-posts (Status Code): "
curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/api/blog-posts
echo ""

echo "--------------------------------------------------"
echo "Verification Complete."
