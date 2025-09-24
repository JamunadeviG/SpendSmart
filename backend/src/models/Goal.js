'use strict';

const { Schema, model } = require('mongoose');

const GoalSchema = new Schema(
  {
    account: { type: Schema.Types.ObjectId, ref: 'FamilyAccount', required: true },
    memberKey: { type: String, enum: ['member1', 'member2', null], default: null },
    name: { type: String, required: true, trim: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, required: true, default: 0 },
    deadline: { type: Date, required: true }
  },
  { timestamps: true, collection: 'goals' }
);

module.exports = model('Goal', GoalSchema);
