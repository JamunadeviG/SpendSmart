'use strict';

const { Schema, model } = require('mongoose');

const TransactionSchema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: 'FamilyAccount', required: true },
    memberKey: { type: String, required: true, enum: ['member1', 'member2'] },
    amount: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: ['income', 'expense'] },
    date: { type: Date, required: true },
    notes: { type: String, default: '', trim: true },
    splitWith: { type: [String], default: [] }
  },
  { timestamps: true, collection: 'transactions' }
);

module.exports = model('Transaction', TransactionSchema);

