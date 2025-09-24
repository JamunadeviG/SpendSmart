'use strict';

const express = require('express');
const { body, query } = require('express-validator');
const ctrl = require('../controllers/budgetController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('memberKey').optional({ nullable: true }).isIn(['member1', 'member2']).withMessage('memberKey must be member1 or member2'),
    body('category').isString().trim().notEmpty(),
    body('amount').isFloat({ gt: 0 }),
    body('period').optional().isIn(['weekly', 'monthly', 'yearly']),
    body('startDate').optional().isISO8601(),
    body('endDate').optional().isISO8601()
  ],
  ctrl.create
);

router.get('/', [query('memberKey').optional().isIn(['member1', 'member2', 'family'])], ctrl.list);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
