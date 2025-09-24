'use strict';

const { Transaction } = require('../models');

function buildDateFilter(from, to) {
  if (!from && !to) return undefined;
  const f = {};
  if (from) f.$gte = new Date(from);
  if (to) f.$lte = new Date(to);
  return f;
}

exports.summary = async (req, res) => {
  try {
    const { view = 'family', memberKey, from, to } = req.query;

    const match = { account: req.user.accountId };
    const dateFilter = buildDateFilter(from, to);
    if (dateFilter) match.date = dateFilter;

    if (view === 'individual') {
      if (!memberKey || !['member1', 'member2'].includes(memberKey)) {
        return res.status(400).json({ message: "memberKey is required as 'member1' or 'member2' for individual view" });
      }
      match.memberKey = memberKey;
    }

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ];

    const byCategoryRaw = await Transaction.aggregate(pipeline);

    const byCategoryMap = {};
    let income = 0;
    let expense = 0;

    for (const row of byCategoryRaw) {
      const cat = row._id.category;
      const typ = row._id.type;
      const total = row.total;
      if (!byCategoryMap[cat]) byCategoryMap[cat] = { category: cat, income: 0, expense: 0 };
      if (typ === 'income') {
        byCategoryMap[cat].income += total;
        income += total;
      } else if (typ === 'expense') {
        byCategoryMap[cat].expense += total;
        expense += total;
      }
    }

    const byCategory = Object.values(byCategoryMap).sort((a, b) => a.category.localeCompare(b.category));

    // Daily trend
    const trendPipeline = [
      { $match: match },
      {
        $group: {
          _id: { day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.day': 1 } }
    ];

    const trendRaw = await Transaction.aggregate(trendPipeline);
    const trendMap = {};
    for (const row of trendRaw) {
      const day = row._id.day;
      if (!trendMap[day]) trendMap[day] = { date: day, income: 0, expense: 0 };
      trendMap[day][row._id.type] += row.total;
    }
    const trend = Object.values(trendMap);

    return res.json({
      totals: { income, expense, net: income - expense },
      byCategory,
      trend
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to compute summary', error: err.message });
  }
};
