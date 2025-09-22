'use strict';

const { Schema, model } = require('mongoose');

const TransactionSchema = new Schema(
  {
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['income', 'expense'] },
    date: { type: Date, required: true },
    notes: { type: String, default: '', trim: true }
  },
  { timestamps: true, collection: 'transactions' }
);

module.exports = model('Transaction', TransactionSchema);

