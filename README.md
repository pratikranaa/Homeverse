# Homeverse - Real Estate Platform

Homeverse is a modern, full-stack real estate platform designed to connect buyers, sellers, and brokers. It features a dynamic frontend, a custom backend for business logic, and a headless CMS for content management.

## 🚀 Features

*   **Interactive Landing Page**: Merged Buyer and Home content with an interactive CTA section.
*   **Dynamic Content**: Managed via Strapi CMS and a Custom Node.js Backend.
*   **Role-Based Flows**: Dedicated sections for Buyers, Sellers, and Brokers.
*   **Form Handling**: robust form processing for callbacks and broker inquiries.
*   **Responsive Design**: Built with Next.js and Tailwind CSS for all devices.

## 🏗️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.
*   **Custom Backend**: Node.js, Express.js, PostgreSQL, Sequelize.
*   **CMS**: Strapi v5 (Headless CMS).
*   **Database**: PostgreSQL.

## 📂 Project Structure

```bash
├── frontend/          # Next.js application
├── custom-backend/    # Express.js API & Business Logic
├── strapi-backend/    # Strapi Headless CMS
└── docs/              # Detailed documentation
```

## 📖 Documentation

For detailed information, please refer to the documentation in the `docs/` folder:

*   [**System Architecture**](docs/ARCHITECTURE.md): High-level overview of the system components and interactions.
*   [**Data Flows**](docs/DATA_FLOWS.md): Detailed diagrams and explanations of how data moves through the system.
*   [**Workflows**](docs/WORKFLOWS.md): Step-by-step guides for common user and developer workflows.
*   [**Setup & Deployment**](docs/DEPLOYMENT.md): Instructions for setting up the project locally and deploying to production.

## ⚡ Quick Start

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/pratikranaa/Homeverse.git
    cd Homeverse
    ```

2.  **Install dependencies** (in each directory):
    ```bash
    cd frontend && npm install
    cd ../custom-backend && npm install
    cd ../strapi-backend && npm install
    ```

3.  **Configure Environment Variables**:
    *   Copy `.env.example` to `.env` in each directory and fill in the required values (Database credentials, API URLs).

4.  **Start the services**:
    *   **Strapi**: `cd strapi-backend && npm run develop`
    *   **Custom Backend**: `cd custom-backend && npm run dev`
    *   **Frontend**: `cd frontend && npm run dev`

5.  **Visit the App**: Open [http://localhost:3002](http://localhost:3002) in your browser.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License.
