'use strict';

const express = require('express');
const { body, query } = require('express-validator');
const ctrl = require('../controllers/goalController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post(
  '/',
  [
    body('memberKey').optional({ nullable: true }).isIn(['member1', 'member2']).withMessage('memberKey must be member1 or member2'),
    body('name').isString().trim().notEmpty(),
    body('targetAmount').isFloat({ gt: 0 }),
    body('currentAmount').optional().isFloat({ min: 0 }),
    body('deadline').isISO8601()
  ],
  ctrl.create
);

router.get('/', [query('memberKey').optional().isIn(['member1', 'member2', 'family'])], ctrl.list);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
