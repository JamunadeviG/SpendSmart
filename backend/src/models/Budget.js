'use strict';

const { Schema, model } = require('mongoose');

const BudgetSchema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: 'FamilyAccount', required: true },
    memberKey: { type: String, enum: ['member1', 'member2', null], default: null },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    period: { type: String, enum: ['weekly', 'monthly', 'yearly'], default: 'monthly' },
    startDate: { type: Date },
    endDate: { type: Date }
  },
  { timestamps: true, collection: 'budgets' }
);

module.exports = model('Budget', BudgetSchema);
