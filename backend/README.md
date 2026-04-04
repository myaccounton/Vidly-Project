# Vidly API (Backend)

Express REST API for the Vidly movie rental app. Uses MongoDB (Mongoose), JWT auth, Joi validation, and centralized error handling.

## Requirements

- Node.js (v14+ recommended; match your team’s version)
- MongoDB (local instance or Atlas)

## Install

```bash
cd backend
npm install
```

## Configuration

The app loads environment variables with **dotenv** (`require("dotenv").config()` in `index.js`).

Create a `.env` file in this folder (do not commit secrets):

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string (required; used in `index.js` for `mongoose.connect`) |
| `jwtPrivateKey` | Secret for signing JWTs (must match what `config` resolves; see below) |

The **`config`** package maps overrides via `config/custom-environment-variables.json`:

- `db` ← `MONGODB_URI`
- `jwtPrivateKey` ← `jwtPrivateKey`

Defaults live in `config/default.json` (suitable for local dev only). Override `jwtPrivateKey` in production.

## Run

```bash
npm start
```

The server listens on **port 10000** (see `index.js`). Health check: open `http://localhost:10000/` — you should see a small JSON welcome payload.

## API overview

All resource routes are mounted under **`/api`** (see `startup/routes.js`):

| Prefix | Area |
|--------|------|
| `/api/auth` | Login (JWT issuance) |
| `/api/users` | Registration |
| `/api/movies` | Movies CRUD and related behavior |
| `/api/genres` | Genres |
| `/api/customers` | Customers |
| `/api/rentals` | Rentals (create, list, user rentals, returns) |
| `/api/returns` | Returns |
| `/api/watchlists` | Watchlists |
| `/api/stats` | Aggregated rental statistics (see below) |

### Stats API (`/api/stats`)

Read-only endpoints implemented in `routes/stats.js`. They aggregate the `Rental` collection (e.g. `rentalFee` field).

| Method | Path | Response |
|--------|------|----------|
| `GET` | `/api/stats/revenue` | `{ "totalRevenue": number }` — sum of all `rentalFee` values (defaults to `0` if none) |
| `GET` | `/api/stats/count` | `{ "totalRentals": number }` — total count of rental documents |

These routes are currently **unauthenticated** in code; restrict them with auth middleware if you expose the API publicly.

Authenticated requests should send the JWT in the **`x-auth-token`** header (see `middleware/auth.js`).

## Project layout

```
backend/
├── config/           # node-config JSON + env mapping
├── middleware/       # auth, validation, errors, uploads, etc.
├── models/           # Mongoose schemas
├── routes/           # Express routers (includes `stats.js` for `/api/stats`)
├── startup/          # routes, DB, logging, production hardening
├── tests/            # Jest (unit + integration)
├── app.js            # Express app (routes + error middleware)
└── index.js          # DB connect + HTTP server (port 10000)
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run the API (`node index.js`) |
| `npm test` | Jest with coverage (Windows script sets `NODE_ENV=test`) |

## Security and quality

- **Helmet**, **CORS**, and production middleware are wired in `startup/prod.js` (loaded from `index.js`).
- Request validation uses **Joi**; invalid IDs use **joi-objectid**.
- Errors flow through `middleware/error` for consistent responses.
- Logging uses **Winston** (`startup/logger.js`).

## Frontend integration

Point the React app at this API. Locally, the frontend often uses base URL `http://localhost:10000/api` so paths like `/movies` resolve to `/api/movies`. Adjust for your deployment (same origin proxy vs. full URL + CORS).
