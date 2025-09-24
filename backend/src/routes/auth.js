'use strict';

const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 6 }),
    body('member1Name').isString().trim().notEmpty(),
    body('member2Name').optional().isString().trim().notEmpty()
  ],
  ctrl.register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty()],
  ctrl.login
);

router.get('/me', require('../middleware/auth'), ctrl.me);

// Update profile (username)
router.put(
  '/profile',
  auth,
  [body('username').isString().trim().notEmpty()],
  ctrl.updateProfile
);

// Change password
router.post(
  '/change-password',
  auth,
  [
    body('oldPassword').isString().isLength({ min: 6 }),
    body('newPassword').isString().isLength({ min: 6 })
  ],
  ctrl.changePassword
);

// Update family member names
router.put(
  '/members',
  auth,
  [
    body('members').isArray({ min: 1, max: 2 }),
    body('members.*.key').isIn(['member1', 'member2']),
    body('members.*.name').isString().trim().notEmpty()
  ],
  ctrl.updateMembers
);

module.exports = router;
