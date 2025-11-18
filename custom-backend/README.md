# Custom Backend

Custom Business + Content Backend - Node.js/Express/PostgreSQL service handling business logic and website content management.

## Project Structure

```
custom-backend/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic services
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Express middleware
│   ├── models/          # Sequelize models
│   ├── db/              # Database config and migrations
│   ├── helpers/         # Utility functions
│   ├── content/         # Content seed data
│   ├── repositories/    # Data access layer
│   └── index.js         # Application entry point
├── logs/                # Application logs
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Run database migrations:
   ```bash
   npm run migrate
   ```

4. Start the server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Content Endpoints (Coming soon)
- `GET /api/v1/content/buyer-landing`
- `GET /api/v1/content/seller-landing`
- `GET /api/v1/content/about`
- `GET /api/v1/content/contact`
- `GET /api/v1/content/home`

### Form Endpoints (Coming soon)
- `POST /api/v1/forms/callback`
- `POST /api/v1/forms/broker`
- `GET /api/v1/forms/broker/status/:id`

## Environment Variables

See `.env.example` for all required environment variables.

## Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **sequelize**: ORM for PostgreSQL
- **joi**: Request validation
- **axios**: HTTP client for external APIs
- **winston**: Logging library
- **dotenv**: Environment variable management
- **pm2**: Process manager for production
- **cors**: CORS middleware
- **express-rate-limit**: Rate limiting middleware

## Deployment

For deployment to AWS, see:
- [Deployment Guide](./DEPLOYMENT.md) - Complete deployment documentation
- [Quick Start Guide](./DEPLOYMENT_QUICKSTART.md) - Quick reference for common tasks
- [Scripts Documentation](./scripts/README.md) - Individual deployment scripts

### Quick Deploy

```bash
# Full deployment (on EC2)
./deploy.sh

# Local testing
./deploy.sh --skip-ami

# View help
./deploy.sh --help
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with initial data
- `npm run db:setup` - Run migrations and seed data
- `npm run db:verify` - Verify database setup
- `npm run build` - Build application
- `npm run deploy` - Full deployment to AWS
- `npm run deploy:local` - Local deployment test (skip AMI)
- `npm run ami:create` - Create AMI from current instance
- `npm run ami:update-template` - Update launch template with new AMI
- `npm run asg:refresh` - Trigger Auto Scaling Group refresh
