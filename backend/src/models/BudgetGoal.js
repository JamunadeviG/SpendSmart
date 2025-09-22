'use strict';

const { Schema, model } = require('mongoose');

const BudgetGoalSchema = new Schema(
  {
    category: { type: String, required: true, trim: true },
    goalAmount: { type: Number, required: true },
    currentSpent: { type: Number, required: true, default: 0 },
    deadline: { type: Date, required: true }
  },
  { timestamps: true, collection: 'budget_goals' }
);

module.exports = model('BudgetGoal', BudgetGoalSchema);

