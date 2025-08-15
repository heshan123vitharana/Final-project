const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(bodyParser.json());

// Health
app.get('/', (req, res) => res.json({ status: 'ok' }));

// Auth routes
app.use('/api/auth', authRoutes);

// Example of a protected route
const { requireAuth } = require('./middleware/authMiddleware');
app.get('/api/profile', requireAuth, (req, res) => {
  res.json({ message: 'Protected route', user: req.user });
});


// Routes
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
