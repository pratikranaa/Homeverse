# Database Setup

This directory contains database configuration, migrations, and seed data for the Custom Backend.

## Database Schema

The application uses PostgreSQL with the following tables:

1. **content_pages** - Stores page metadata (buyer-landing, seller-landing, about, contact, home)
2. **content_sections** - Stores page sections with JSONB content
3. **cta_callback_requests** - Stores callback form submissions
4. **cta_broker_requests** - Stores broker request form submissions
5. **integration_logs** - Logs all API requests to external services
6. **response_logs** - Logs all API responses from external services
7. **error_logs** - Logs all errors during API integration
8. **submission_status** - Tracks form submission status
9. **integration_config** - Stores external API configuration

## Setup Instructions

### Prerequisites

- PostgreSQL 15+ installed and running
- Database created (e.g., `custom_backend_db`)
- Environment variables configured in `.env` file

### Running Migrations

To create all database tables:

```bash
npm run migrate
```

This will:
- Connect to the database using `DATABASE_URL` from `.env`
- Create all tables with proper schema
- Add indexes for optimized queries
- Set up foreign key relationships

### Seeding Data

To populate the database with initial content:

```bash
npm run seed
```

This will:
- Create 5 content pages (buyer-landing, seller-landing, about, contact, home)
- Create sample content sections for each page
- Skip seeding if data already exists

### Complete Setup

To run both migration and seeding in one command:

```bash
npm run db:setup
```

## Database Features

### UUID Primary Keys
All tables use UUID primary keys for better scalability and security.

### Indexes
Optimized indexes on:
- `content_pages.page_key` (unique)
- `content_sections.page_id`
- `content_sections.page_id + section_key` (unique composite)
- `cta_callback_requests.status`
- `cta_broker_requests.status`
- `integration_logs.request_type`
- `submission_status.submission_id`
- `submission_status.status`

### Foreign Key Relationships
- `content_sections.page_id` → `content_pages.id` (CASCADE delete)
- `response_logs.integration_log_id` → `integration_logs.id`
- `error_logs.integration_log_id` → `integration_logs.id`

### JSONB Fields
The following fields use JSONB for flexible schema:
- `content_sections.content` - Stores section content
- `cta_callback_requests.exponentia_response` - Stores API responses
- `cta_broker_requests.exponentia_response` - Stores API responses
- `integration_logs.request_payload` - Stores request data
- `response_logs.response_payload` - Stores response data
- `submission_status.metadata` - Stores additional metadata
- `integration_config.config_value` - Stores configuration values

## Troubleshooting

### Connection Issues

If you encounter connection errors:

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env` file
3. Ensure database exists
4. Verify user permissions

### Migration Failures

If migration fails:

1. Check database logs
2. Verify PostgreSQL version (15+ required)
3. Ensure no conflicting tables exist
4. Check user has CREATE TABLE permissions

### Seed Data Issues

If seeding fails:

1. Run migrations first: `npm run migrate`
2. Check if data already exists (seeding skips if data present)
3. Verify foreign key relationships are intact
