'use strict';

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Load environment variables from backend/.env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { connectToDatabase } = require('./config/db');
const models = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Example route showing models are available
app.get('/models', (req, res) => {
  res.json({ models: Object.keys(models) });
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/transactions', require('./routes/transactions'));
app.use('/budgets', require('./routes/budgets'));
app.use('/goals', require('./routes/goals'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/receipts', require('./routes/receipts'));
app.use('/chat', require('./routes/chat'));

// Start server after DB connection
const port = process.env.PORT || 4000;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server due to DB connection error:', error.message);
    process.exit(1);
  });

module.exports = app;

