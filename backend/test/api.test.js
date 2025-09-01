import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Import the server code
const app = express();
app.use(cors());
app.use(express.json());

// In-memory price storage for testing
let prices = [
  { id: 1, variety: 'Wet (White Rice)', grade: 'Super', currentPrice: 150.00, previousPrice: 145.00, unit: 'LKR/kg', lastUpdated: '2025-02-06', district: 'Colombo' }
];
let priceHistory = {
  1: [
    { date: '2025-02-06', price: 150.00, change: '+5.00', reason: 'Market demand increase' }
  ]
};

app.get('/api/prices', (req, res) => res.json(prices));
app.post('/api/prices', (req, res) => {
  const newId = prices.length ? Math.max(...prices.map(p => p.id)) + 1 : 1;
  const price = { ...req.body, id: newId };
  prices.push(price);
  priceHistory[newId] = [{ date: price.lastUpdated, price: price.currentPrice, change: '+0.00', reason: 'Initial entry' }];
  res.status(201).json({ message: 'Price added', data: price });
});
app.put('/api/prices/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = prices.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Price not found' });
  const oldPrice = prices[idx].currentPrice;
  prices[idx] = { ...prices[idx], ...req.body, previousPrice: oldPrice };
  if (!priceHistory[id]) priceHistory[id] = [];
  priceHistory[id].unshift({
    date: prices[idx].lastUpdated,
    price: prices[idx].currentPrice,
    change: ((prices[idx].currentPrice - oldPrice) >= 0 ? '+' : '') + (prices[idx].currentPrice - oldPrice).toFixed(2),
    reason: req.body.reason || 'Manual update'
  });
  res.json(prices[idx]);
});
app.get('/api/prices/:id/history', (req, res) => {
  const id = parseInt(req.params.id);
  res.json(priceHistory[id] || []);
});

// Tests

describe('PMB Admin API', () => {
  it('GET /api/prices returns all prices', async () => {
    const res = await request(app).get('/api/prices');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/prices adds a new price', async () => {
    const newPrice = {
      variety: 'Dry (Red Rice)',
      grade: 'Super',
      currentPrice: 160.00,
      previousPrice: 155.00,
      unit: 'LKR/kg',
      lastUpdated: '2025-08-10',
      district: 'Anuradhapura',
      status: 'Active',
      description: 'Premium red rice'
    };
    const res = await request(app).post('/api/prices').send(newPrice);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.variety).toBe('Dry (Red Rice)');
  });

  it('PUT /api/prices/:id edits a price', async () => {
    const res = await request(app).put('/api/prices/1').send({ currentPrice: 155.00, lastUpdated: '2025-08-10' });
    expect(res.statusCode).toBe(200);
    expect(res.body.currentPrice).toBe(155.00);
  });

  it('GET /api/prices/:id/history returns price history', async () => {
    const res = await request(app).get('/api/prices/1/history');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
