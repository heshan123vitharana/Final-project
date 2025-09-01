# Paddy Marketing Board Admin Backend

This backend provides API endpoints for the PMB admin dashboard. Built with Express.js.

## Features
- Get rice/paddy prices
- Add new price entries
- Get price history

## Quick Start
1. Run `npm install` in the backend folder
2. Start the server with `npm start`
3. API runs on port 5000 by default

## Endpoints
- `GET /api/prices` — List all prices
- `POST /api/prices` — Add a new price
- `GET /api/prices/:id/history` — Get price history for a price entry

## Note
Replace in-memory data with a database for production use.
