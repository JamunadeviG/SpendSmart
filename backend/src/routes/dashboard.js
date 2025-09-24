'use strict';

const express = require('express');
const { query } = require('express-validator');
const ctrl = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get(
  '/summary',
  [
    query('view').optional().isIn(['family', 'individual']),
    query('memberKey').optional().isIn(['member1', 'member2']),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601()
  ],
  ctrl.summary
);

module.exports = router;
