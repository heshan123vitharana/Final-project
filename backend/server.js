import express from 'express';
import cors from 'cors';
import process from 'process';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory price storage
let prices = [
  { id: 1, variety: 'Wet (White Rice)', grade: 'Super', currentPrice: 150.00, previousPrice: 145.00, unit: 'LKR/kg', lastUpdated: '2025-02-06', district: 'Colombo' },
  { id: 2, variety: 'Wet (White Rice)', grade: 'Grade 1', currentPrice: 138.00, previousPrice: 135.00, unit: 'LKR/kg', lastUpdated: '2025-02-06', district: 'Gampaha' },
  { id: 5, variety: 'Dry (Red Rice)', grade: 'Super', currentPrice: 165.00, previousPrice: 160.00, unit: 'LKR/kg', lastUpdated: '2025-02-06', district: 'Anuradhapura' }
];
let priceHistory = {
  1: [
    { date: '2025-02-06', price: 150.00, change: '+5.00', reason: 'Market demand increase' },
    { date: '2025-02-01', price: 145.00, change: '+2.00', reason: 'Quality premium adjustment' }
  ],
  2: [
    { date: '2025-02-06', price: 138.00, change: '+3.00', reason: 'Consistent with premium grade' }
  ],
  5: [
    { date: '2025-02-06', price: 165.00, change: '+5.00', reason: 'Premium red rice demand' }
  ]
};

// Get all prices
app.get('/api/prices', (req, res) => {
  res.json(prices);
});

// Add new price
app.post('/api/prices', (req, res) => {
  const newId = prices.length ? Math.max(...prices.map(p => p.id)) + 1 : 1;
  const price = { ...req.body, id: newId };
  prices.push(price);
  priceHistory[newId] = [
    { date: price.lastUpdated, price: price.currentPrice, change: '+0.00', reason: 'Initial entry' }
  ];
  res.status(201).json({ message: 'Price added', data: price });
});

// Edit price
app.put('/api/prices/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = prices.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Price not found' });
  const oldPrice = prices[idx].currentPrice;
  prices[idx] = { ...prices[idx], ...req.body, previousPrice: oldPrice };
  // Add to history
  if (!priceHistory[id]) priceHistory[id] = [];
  priceHistory[id].unshift({
    date: prices[idx].lastUpdated,
    price: prices[idx].currentPrice,
    change: ((prices[idx].currentPrice - oldPrice) >= 0 ? '+' : '') + (prices[idx].currentPrice - oldPrice).toFixed(2),
    reason: req.body.reason || 'Manual update'
  });
  res.json(prices[idx]);
});

// Get price history
app.get('/api/prices/:id/history', (req, res) => {
  const id = parseInt(req.params.id);
  res.json(priceHistory[id] || []);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PMB Admin Backend running on port ${PORT}`);
});
