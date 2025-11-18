# Workflows

This document outlines the key workflows for developers and administrators working with the Homeverse platform.

## 1. Development Workflows

### Setting Up the Environment
1.  **Clone the Repository**: `git clone <repo-url>`
2.  **Install Dependencies**: Run `npm install` in `frontend/`, `custom-backend/`, and `strapi-backend/`.
3.  **Configure Environment**: Create `.env` files in each directory based on `.env.example`.
4.  **Start Databases**: Ensure PostgreSQL is running and databases (`strapi_blog`, `custom_backend_db`) are created.

### Adding a New Page Section
1.  **Define Data Model**:
    *   If dynamic (e.g., new blog type), add Content Type in Strapi.
    *   If static/structural (e.g., new landing page section), add to `ContentSection` model in Custom Backend.
2.  **Update Seed Data**: Add the new section to `custom-backend/src/db/seed.js` for reproducibility.
3.  **Frontend Implementation**:
    *   Create a new component in `frontend/src/components/sections/`.
    *   Update `SectionRenderer.tsx` to map the new section type to the component.
    *   Add necessary types to `frontend/src/lib/api/content.ts`.

### Modifying the Interactive CTA
1.  **Edit Component**: Modify `frontend/src/components/sections/CTASection.tsx`.
2.  **Update State**: If adding new views, update the `ViewState` type and `AnimatePresence` logic.
3.  **Verify**: Test the toggle interaction and form rendering.

## 2. Content Management Workflows

### Creating a Blog Post
1.  **Login to Strapi**: Go to `http://localhost:1337/admin`.
2.  **Navigate**: Content Manager -> Blog Post.
3.  **Create**: Click "+ Create new entry".
4.  **Fill Content**: Title, Content, Author, Category, Cover Image.
5.  **Publish**: Click "Save" and then "Publish".
6.  **Verify**: Check the Blog section on the frontend.

### Updating Landing Page Text
1.  **Database Update**: Currently, landing page text is stored in the Custom Backend database.
2.  **Method**: Use a database client (e.g., DBeaver, pgAdmin) or update the seed script and re-seed (for development).
    *   *Future Improvement*: Build an Admin UI for the Custom Backend.

## 3. Deployment Workflows

### Staging Deployment
1.  **Push to Git**: Commit changes and push to the `staging` branch (if applicable) or `main`.
2.  **CI/CD**: Automated pipeline (e.g., GitHub Actions) builds the application.
3.  **Deploy**:
    *   Frontend -> Vercel/Netlify.
    *   Backends -> Heroku/DigitalOcean/AWS.
4.  **Verify**: Run smoke tests on the staging URL.

### Production Release
1.  **Merge**: Merge `staging` into `main` (or tag a release).
2.  **Deploy**: Trigger production deployment pipeline.
3.  **Monitor**: Check logs for errors and monitor performance.
