# Requirements Document

## Introduction

This document defines the requirements for a dual-backend architecture consisting of two independent services: a Custom Business + Content Backend (Node.js/Express/PostgreSQL) and a Strapi Backend (blog CMS only). The Custom Backend handles all business logic (callback/broker forms, third-party API integration) and website content (excluding blogs). The Strapi Backend is strictly limited to blog management functionality.

## Glossary

- **Custom Backend**: Node.js/Express/PostgreSQL service managing business logic and non-blog content
- **Strapi Backend**: Headless CMS service managing only blog-related content
- **Exponentia API**: Third-party external API receiving form submission data
- **Frontend**: Client application consuming both backend services
- **Content Page**: Static website page content (buyer landing, seller landing, about, contact, home)
- **CTA Form**: Call-to-action form (callback request or broker request)
- **Submission Status**: State tracking for form submissions sent to Exponentia API
- **WhatsApp Bot**: External service receiving redirect logic after form submission

## Requirements

### Requirement 1

**User Story:** As a website visitor, I want to submit a callback request form, so that the business can contact me later

#### Acceptance Criteria

1. WHEN a visitor submits a callback request form, THE Custom Backend SHALL validate the form data against defined schema rules
2. WHEN form validation succeeds, THE Custom Backend SHALL send the validated data to the Exponentia API
3. IF the Exponentia API call fails, THEN THE Custom Backend SHALL retry the request up to three times with exponential backoff
4. WHEN the Exponentia API responds, THE Custom Backend SHALL log the complete request and response data
5. WHEN the submission completes successfully, THE Custom Backend SHALL return a success response with submission tracking identifier

### Requirement 2

**User Story:** As a website visitor, I want to submit a broker request form, so that I can connect with a real estate broker

#### Acceptance Criteria

1. WHEN a visitor submits a broker request form, THE Custom Backend SHALL validate the form data against defined schema rules
2. WHEN form validation succeeds, THE Custom Backend SHALL send the validated data to the Exponentia API
3. IF the Exponentia API call fails, THEN THE Custom Backend SHALL retry the request up to three times with exponential backoff
4. WHEN the Exponentia API responds, THE Custom Backend SHALL log the complete request and response data
5. WHEN the submission completes successfully, THE Custom Backend SHALL trigger redirect logic to the WhatsApp Bot

### Requirement 3

**User Story:** As a website visitor, I want to check the status of my form submission, so that I can verify it was processed successfully

#### Acceptance Criteria

1. WHEN a visitor requests submission status with a valid tracking identifier, THE Custom Backend SHALL retrieve the submission record from the database
2. IF the tracking identifier does not exist, THEN THE Custom Backend SHALL return a not found error response
3. WHEN the submission record exists, THE Custom Backend SHALL return the current status and timestamp information
4. THE Custom Backend SHALL expose submission status through a GET endpoint at /forms/broker/status/:id

### Requirement 4

**User Story:** As a frontend developer, I want to fetch buyer landing page content, so that I can display it to website visitors

#### Acceptance Criteria

1. WHEN the frontend requests buyer landing page content, THE Custom Backend SHALL retrieve all sections for the buyer landing page from the database
2. THE Custom Backend SHALL return content in structured JSON format with section identifiers and content fields
3. THE Custom Backend SHALL expose buyer landing content through a GET endpoint at /content/buyer-landing
4. THE Custom Backend SHALL return cached content when available to minimize database queries

### Requirement 5

**User Story:** As a frontend developer, I want to fetch seller landing page content, so that I can display it to website visitors

#### Acceptance Criteria

1. WHEN the frontend requests seller landing page content, THE Custom Backend SHALL retrieve all sections for the seller landing page from the database
2. THE Custom Backend SHALL return content in structured JSON format with section identifiers and content fields
3. THE Custom Backend SHALL expose seller landing content through a GET endpoint at /content/seller-landing
4. THE Custom Backend SHALL return cached content when available to minimize database queries

### Requirement 6

**User Story:** As a frontend developer, I want to fetch about page content, so that I can display company information to visitors

#### Acceptance Criteria

1. WHEN the frontend requests about page content, THE Custom Backend SHALL retrieve all sections for the about page from the database
2. THE Custom Backend SHALL return content in structured JSON format with section identifiers and content fields
3. THE Custom Backend SHALL expose about page content through a GET endpoint at /content/about

### Requirement 7

**User Story:** As a frontend developer, I want to fetch contact page content, so that I can display contact information to visitors

#### Acceptance Criteria

1. WHEN the frontend requests contact page content, THE Custom Backend SHALL retrieve all sections for the contact page from the database
2. THE Custom Backend SHALL return content in structured JSON format with section identifiers and content fields
3. THE Custom Backend SHALL expose contact page content through a GET endpoint at /content/contact

### Requirement 8

**User Story:** As a frontend developer, I want to fetch home page content, so that I can display banners, testimonials, and FAQs to visitors

#### Acceptance Criteria

1. WHEN the frontend requests home page content, THE Custom Backend SHALL retrieve all sections including banners, testimonials, and FAQs from the database
2. THE Custom Backend SHALL return content in structured JSON format with section identifiers and content fields
3. THE Custom Backend SHALL expose home page content through a GET endpoint at /content/home

### Requirement 9

**User Story:** As a system administrator, I want all API interactions logged, so that I can troubleshoot integration issues

#### Acceptance Criteria

1. WHEN the Custom Backend sends a request to the Exponentia API, THE Custom Backend SHALL log the complete request payload with timestamp
2. WHEN the Custom Backend receives a response from the Exponentia API, THE Custom Backend SHALL log the complete response data with timestamp
3. IF an error occurs during API communication, THEN THE Custom Backend SHALL log the error details with stack trace
4. THE Custom Backend SHALL store all logs in dedicated database tables for persistence

### Requirement 10

**User Story:** As a blog reader, I want to view a list of blog posts, so that I can browse available content

#### Acceptance Criteria

1. WHEN a visitor requests the blog listing, THE Strapi Backend SHALL retrieve all published blog posts from the database
2. THE Strapi Backend SHALL return blog posts with title, excerpt, featured image, category, author, and publication date
3. THE Strapi Backend SHALL expose blog listing through a GET endpoint at /blogs
4. THE Strapi Backend SHALL support pagination parameters for the blog listing

### Requirement 11

**User Story:** As a blog reader, I want to view a specific blog post by its URL slug, so that I can read the full content

#### Acceptance Criteria

1. WHEN a visitor requests a blog post by slug, THE Strapi Backend SHALL retrieve the complete blog post from the database
2. THE Strapi Backend SHALL return the full blog content including title, body, featured image, category, author, metadata, and SEO fields
3. THE Strapi Backend SHALL expose individual blog posts through a GET endpoint at /blogs/:slug
4. IF the slug does not exist, THEN THE Strapi Backend SHALL return a not found error response

### Requirement 12

**User Story:** As a blog reader, I want to filter blogs by category, so that I can find content on specific topics

#### Acceptance Criteria

1. WHEN a visitor requests blog categories, THE Strapi Backend SHALL retrieve all available categories from the database
2. THE Strapi Backend SHALL return categories with name, slug, and description fields
3. THE Strapi Backend SHALL expose blog categories through a GET endpoint at /blog-categories
4. THE Strapi Backend SHALL support filtering blogs by category identifier

### Requirement 13

**User Story:** As a blog reader, I want to see author information, so that I know who wrote the content

#### Acceptance Criteria

1. WHEN a visitor requests blog authors, THE Strapi Backend SHALL retrieve all author profiles from the database
2. THE Strapi Backend SHALL return author information including name, bio, avatar, and social links
3. THE Strapi Backend SHALL expose blog authors through a GET endpoint at /blog-authors

### Requirement 14

**User Story:** As a content manager, I want blog media files stored securely, so that images and assets are accessible to readers

#### Acceptance Criteria

1. WHEN a content manager uploads media through Strapi, THE Strapi Backend SHALL store the file in AWS S3
2. THE Strapi Backend SHALL generate a public URL for the uploaded media file
3. THE Strapi Backend SHALL associate uploaded media with blog posts through database relations
4. THE Strapi Backend SHALL support common image formats including JPEG, PNG, and WebP

### Requirement 15

**User Story:** As a system operator, I want both backends deployed on AWS, so that the services are scalable and reliable

#### Acceptance Criteria

1. THE Custom Backend SHALL be deployed on AWS EC2 instances behind an Application Load Balancer
2. THE Custom Backend SHALL connect to AWS RDS PostgreSQL for data persistence
3. THE Strapi Backend SHALL be deployed on AWS EC2 instances behind an Application Load Balancer
4. THE Strapi Backend SHALL connect to AWS RDS PostgreSQL for data persistence
5. THE Strapi Backend SHALL use AWS S3 for media file storage

### Requirement 16

**User Story:** As a developer, I want clear API boundaries between services, so that I can maintain and scale each backend independently

#### Acceptance Criteria

1. THE Custom Backend SHALL expose only content and business form endpoints
2. THE Strapi Backend SHALL expose only blog-related endpoints
3. THE Frontend SHALL consume Custom Backend APIs for all non-blog content and forms
4. THE Frontend SHALL consume Strapi Backend APIs only for blog functionality
5. WHEN either backend is unavailable, THE Frontend SHALL handle the failure gracefully without affecting the other service

### Requirement 17

**User Story:** As a security administrator, I want API endpoints to be publicly accessible without authentication, so that the frontend can access content freely

#### Acceptance Criteria

1. THE Custom Backend SHALL allow unauthenticated GET requests to all content endpoints
2. THE Custom Backend SHALL allow unauthenticated POST requests to form submission endpoints
3. THE Strapi Backend SHALL configure public read permissions for all blog content types
4. THE Strapi Backend SHALL restrict write permissions to authenticated admin users only

### Requirement 18

**User Story:** As a developer, I want versioned APIs, so that I can introduce changes without breaking existing integrations

#### Acceptance Criteria

1. THE Custom Backend SHALL prefix all API routes with version identifier /api/v1
2. THE Strapi Backend SHALL prefix all API routes with version identifier /api
3. WHEN introducing breaking changes, THE Custom Backend SHALL create a new version namespace
4. THE Custom Backend SHALL maintain backward compatibility for at least one previous API version
