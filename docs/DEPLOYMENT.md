# Setup and Deployment Guide

This guide covers how to set up the Homeverse application locally and deploy it to production.

## 1. Local Development Setup

### Prerequisites
*   Node.js (v18 or later)
*   npm (v9 or later)
*   PostgreSQL (v14 or later)
*   Git

### Step-by-Step Instructions

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/pratikranaa/Homeverse.git
    cd Homeverse
    ```

2.  **Database Setup**
    *   Create two PostgreSQL databases:
        *   `strapi_blog`
        *   `custom_backend_db`
    *   Ensure you have a database user (e.g., `postgres`) with a password.

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    cp .env.example .env.local
    # Edit .env.local with:
    # NEXT_PUBLIC_API_URL=http://localhost:3001
    # NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
    npm run dev
    ```

4.  **Custom Backend Setup**
    ```bash
    cd ../custom-backend
    npm install
    cp .env.example .env
    # Edit .env with DB credentials
    npm run migrate # Run migrations (if applicable)
    npm run seed    # Seed initial data
    npm run dev
    ```

5.  **Strapi Setup**
    ```bash
    cd ../strapi-backend
    npm install
    cp .env.example .env
    # Edit .env with DB credentials
    npm run develop
    ```

6.  **Access the App**
    *   Frontend: `http://localhost:3002`
    *   Custom Backend API: `http://localhost:3001`
    *   Strapi Admin: `http://localhost:1337/admin`

## 2. Production Deployment

### Architecture
*   **Frontend**: Deployed as a Next.js app (Serverless or Node.js server).
*   **Backends**: Deployed as Node.js services.
*   **Database**: Managed PostgreSQL instance (e.g., AWS RDS, DigitalOcean Managed DB).

### Deployment Options

#### Option A: Vercel (Frontend) + Railway/Render (Backends)

1.  **Frontend (Vercel)**
    *   Connect GitHub repo.
    *   Set Root Directory to `frontend`.
    *   Add Environment Variables (`NEXT_PUBLIC_API_URL`, etc.).
    *   Deploy.

2.  **Backends (Railway/Render)**
    *   Create two services (one for Custom Backend, one for Strapi).
    *   Connect GitHub repo.
    *   Set Root Directory to `custom-backend` and `strapi-backend` respectively.
    *   Add Environment Variables (DB credentials, etc.).
    *   Provision a PostgreSQL database and link it.

#### Option B: VPS (DigitalOcean/AWS EC2)

1.  **Provision Server**: Ubuntu 22.04 LTS.
2.  **Install Dependencies**: Node.js, Nginx, PM2, PostgreSQL (or use managed DB).
3.  **Clone Repo**: `git clone ...`
4.  **Build & Run**:
    *   **Frontend**: `npm run build && pm2 start npm --name "frontend" -- start`
    *   **Custom Backend**: `pm2 start src/index.js --name "custom-backend"`
    *   **Strapi**: `npm run build && pm2 start npm --name "strapi" -- run start`
5.  **Nginx Reverse Proxy**: Configure Nginx to route traffic:
    *   `example.com` -> Frontend (Port 3000)
    *   `api.example.com` -> Custom Backend (Port 3001)
    *   `cms.example.com` -> Strapi (Port 1337)
6.  **SSL**: Use Certbot (Let's Encrypt) for HTTPS.

## 3. Environment Variables Reference

### Frontend
| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | URL of the Custom Backend API |
| `NEXT_PUBLIC_STRAPI_URL` | URL of the Strapi CMS |

### Custom Backend
| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection String |
| `PORT` | Server Port (default: 3001) |
| `CORS_ORIGIN` | Allowed Frontend Origin |

### Strapi
| Variable | Description |
| :--- | :--- |
| `DATABASE_HOST` | DB Host |
| `DATABASE_PORT` | DB Port |
| `DATABASE_NAME` | DB Name |
| `DATABASE_USERNAME` | DB User |
| `DATABASE_PASSWORD` | DB Password |
| `APP_KEYS` | Strapi Security Keys |
| `API_TOKEN_SALT` | Strapi API Token Salt |
| `ADMIN_JWT_SECRET` | Strapi Admin JWT Secret |
| `TRANSFER_TOKEN_SALT` | Strapi Transfer Token Salt |
