'use strict';

const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

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

