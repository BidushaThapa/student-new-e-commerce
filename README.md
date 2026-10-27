# ShopNest

ShopNest is a student e-commerce platform built with NestJS, PostgreSQL,
TypeORM, React, TypeScript, Vite, and Tailwind CSS.

## Project layout

- `src/`: NestJS API and database modules
- `frontend/`: React customer storefront and `/admin` application routes
- `src/migrations/`: TypeORM migrations; existing migrations are preserved
- `.env.example`: required backend environment variables

Docker files are intentionally unchanged.

## Setup

1. Copy `.env.example` to `.env`.
2. Replace every placeholder secret and database value.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the API:

   ```bash
   npm run start:dev
   ```

5. Start the React development server in another terminal:

   ```bash
   npm run frontend:dev
   ```

The Vite server runs on `http://localhost:5173` and proxies `/api` requests
to the NestJS server on port `3000`.

## Validation

```bash
npm run build
npm run build:frontend
npm run lint
```

The backend requires database, JWT, and Cloudinary values at startup. Secrets
must remain in local `.env` files and must not be committed or exposed to the
React application.
