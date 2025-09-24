'use strict';

const { validationResult } = require('express-validator');
const { Goal } = require('../models');

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const doc = await Goal.create({
      account: req.user.accountId,
      memberKey: req.body.memberKey ?? null,
      name: req.body.name,
      targetAmount: req.body.targetAmount,
      currentAmount: req.body.currentAmount ?? 0,
      deadline: new Date(req.body.deadline)
    });
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create goal', error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { memberKey } = req.query;
    const filter = { account: req.user.accountId };
    if (memberKey === 'member1' || memberKey === 'member2') filter.memberKey = memberKey;
    if (memberKey === 'family') filter.memberKey = null;

    const docs = await Goal.find(filter).sort({ deadline: 1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list goals', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.deadline) update.deadline = new Date(update.deadline);
    const doc = await Goal.findOneAndUpdate(
      { _id: req.params.id, account: req.user.accountId },
      update,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Goal not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update goal', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const doc = await Goal.findOneAndDelete({ _id: req.params.id, account: req.user.accountId });
    if (!doc) return res.status(404).json({ message: 'Goal not found' });
    return res.json({ message: 'Deleted', id: doc._id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete goal', error: err.message });
  }
};
