'use strict';

const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.substring('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const payload = jwt.verify(token, secret);
    req.user = { userId: payload.userId, accountId: payload.accountId };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
