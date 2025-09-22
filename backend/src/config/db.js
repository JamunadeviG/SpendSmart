'use strict';

const mongoose = require('mongoose');

let isConnected = false;

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set. Please configure it in your .env file.');
  }

  if (isConnected) {
    return mongoose.connection;
  }

  try {
    mongoose.connection.on('connected', () => {
      isConnected = true;
      // eslint-disable-next-line no-console
      console.log('MongoDB connected');
    });

    mongoose.connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      // eslint-disable-next-line no-console
      console.warn('MongoDB disconnected');
    });

    // Close MongoDB connection on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      // eslint-disable-next-line no-console
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });

    return mongoose.connection;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to MongoDB:', error.message);
    throw error;
  }
}

module.exports = { connectToDatabase };

