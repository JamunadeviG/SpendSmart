'use strict';

const express = require('express');
const { body, query } = require('express-validator');
const ctrl = require('../controllers/transactionController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('memberKey').isIn(['member1', 'member2']),
    body('amount').isFloat({ gt: 0 }),
    body('type').isIn(['income', 'expense']),
    body('category').isString().trim().notEmpty(),
    body('date').isISO8601().toDate(),
    body('notes').optional().isString().trim()
  ],
  ctrl.create
);

router.get(
  '/',
  [
    query('memberKey').optional().isIn(['member1', 'member2']),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('type').optional().isIn(['income', 'expense']),
    query('category').optional().isString().trim()
  ],
  ctrl.list
);

router.get('/:id', ctrl.getOne);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
