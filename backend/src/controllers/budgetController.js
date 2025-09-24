'use strict';

const { validationResult } = require('express-validator');
const { Budget } = require('../models');

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const doc = await Budget.create({
      account: req.user.accountId,
      memberKey: req.body.memberKey ?? null,
      category: req.body.category,
      amount: req.body.amount,
      period: req.body.period || 'monthly',
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined
    });
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create budget', error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { memberKey } = req.query;
    const filter = { account: req.user.accountId };
    if (memberKey === 'member1' || memberKey === 'member2') filter.memberKey = memberKey;
    if (memberKey === 'family') filter.memberKey = null;

    const docs = await Budget.find(filter).sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list budgets', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.startDate) update.startDate = new Date(update.startDate);
    if (update.endDate) update.endDate = new Date(update.endDate);
    const doc = await Budget.findOneAndUpdate(
      { _id: req.params.id, account: req.user.accountId },
      update,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Budget not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update budget', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const doc = await Budget.findOneAndDelete({ _id: req.params.id, account: req.user.accountId });
    if (!doc) return res.status(404).json({ message: 'Budget not found' });
    return res.json({ message: 'Deleted', id: doc._id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete budget', error: err.message });
  }
};
