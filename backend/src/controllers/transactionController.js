'use strict';

const { validationResult } = require('express-validator');
const { Transaction } = require('../models');

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { memberKey, amount, type, category, date, notes, splitWith } = req.body;
    
    if (splitWith && splitWith.length > 0) {
      // Handle split transactions
      const totalMembers = 1 + splitWith.length; // current member + split members
      const splitAmount = amount / totalMembers;
      
      const transactions = [];
      
      // Create transaction for the primary member
      const primaryTransaction = await Transaction.create({
        account: req.user.accountId,
        memberKey: memberKey,
        amount: splitAmount,
        type: type,
        category: category,
        date: new Date(date),
        notes: notes || '',
        splitWith: splitWith
      });
      transactions.push(primaryTransaction);
      
      // Create transactions for split members
      for (const splitMember of splitWith) {
        // Find the member key for the split member
        const FamilyAccount = require('../models/FamilyAccount');
        const account = await FamilyAccount.findById(req.user.accountId);
        const member = account.members.find(m => m.name === splitMember);
        
        if (member) {
          const splitTransaction = await Transaction.create({
            account: req.user.accountId,
            memberKey: member.key,
            amount: splitAmount,
            type: type,
            category: category,
            date: new Date(date),
            notes: `${notes || category} (split with ${memberKey})`,
            splitWith: splitWith
          });
          transactions.push(splitTransaction);
        }
      }
      
      return res.status(201).json(transactions);
    } else {
      // Single transaction (no split)
      const doc = await Transaction.create({
        account: req.user.accountId,
        memberKey: memberKey,
        amount: amount,
        type: type,
        category: category,
        date: new Date(date),
        notes: notes || '',
        splitWith: []
      });
      return res.status(201).json([doc]);
    }
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create transaction', error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { memberKey, from, to, type, category } = req.query;
    const filter = { account: req.user.accountId };
    if (memberKey) filter.memberKey = memberKey;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const results = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    return res.json(results);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list transactions', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const doc = await Transaction.findOne({ _id: req.params.id, account: req.user.accountId });
    if (!doc) return res.status(404).json({ message: 'Transaction not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to get transaction', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.date) update.date = new Date(update.date);
    const doc = await Transaction.findOneAndUpdate(
      { _id: req.params.id, account: req.user.accountId },
      update,
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Transaction not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update transaction', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const doc = await Transaction.findOneAndDelete({ _id: req.params.id, account: req.user.accountId });
    if (!doc) return res.status(404).json({ message: 'Transaction not found' });
    return res.json({ message: 'Deleted', id: doc._id });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete transaction', error: err.message });
  }
};
