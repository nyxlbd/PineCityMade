# Pine City Made

Pine City Made is a full-stack e-commerce marketplace focused on Baguio-based local businesses, artisans, and makers. The project is structured as a modular React + Vite frontend and Express + MongoDB backend.

## Features

- Buyer, seller, and admin user roles
- Marketplace browsing, product search, and filtering
- Seller registration and approval flow
- Product management and category administration
- Shopping cart and checkout flow
- MongoDB-backed metadata and image references
- JWT auth and protected routes
- Responsive storefront design for Baguio-themed products

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT + bcryptjs
- Storage: MongoDB metadata and modular image service abstraction for Cloudinary or GridFS later

## Project Structure

```text
pine-city-made/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies for both apps.
2. Create a local `.env` file from `.env.example`.
3. Ensure MongoDB is running locally or set `MONGODB_URI` to a remote instance.
4. Start the dev servers.

```bash
npm install
npm --prefix client install
npm --prefix server install
npm run dev
```

## Environment Variables

See `.env.example` for required values.

## API Overview

- `GET /api/health` – app health status
- `POST /api/auth/register` – create user account
- `POST /api/auth/login` – authenticate user
- `GET /api/products` – list products
- `GET /api/categories` – list categories

## Notes

This repository starts with the foundational architecture and initial storefront implementation. Authentication, seller modules, orders, checkout, and admin dashboards will be added incrementally.
