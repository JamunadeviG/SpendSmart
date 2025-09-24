'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { UserCredential, FamilyAccount } = require('../models');

function signToken(user) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const payload = { userId: user._id.toString(), accountId: user.account?.toString() };
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, member1Name, member2Name } = req.body;

  try {
    const existing = await UserCredential.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserCredential.create({ username, email, passwordHash });

    const members = [{ key: 'member1', name: member1Name }];
    if (member2Name && String(member2Name).trim()) {
      members.push({ key: 'member2', name: String(member2Name).trim() });
    }
    const account = await FamilyAccount.create({ owner: user._id, members });

    user.account = account._id;
    await user.save();

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
      account: {
        id: account._id,
        members: account.members
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await UserCredential.findOne({ email }).populate('account');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
      account: {
        id: user.account?._id,
        members: user.account?.members || []
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await UserCredential.findById(req.user.userId).populate('account');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({
      user: { id: user._id, username: user.username, email: user.email },
      account: { id: user.account?._id, members: user.account?.members || [] }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { username } = req.body;
  try {
    const user = await UserCredential.findByIdAndUpdate(
      req.user.userId,
      { username },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await UserCredential.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Old password is incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json({ message: 'Password updated' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to change password', error: err.message });
  }
};

exports.updateMembers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { members } = req.body; // [{ key: 'member1'|'member2', name: string }]
  try {
    const user = await UserCredential.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.account) return res.status(400).json({ message: 'User has no linked account' });

    const account = await FamilyAccount.findById(user.account);
    if (!account) return res.status(404).json({ message: 'Family account not found' });

    // Create a map of member data from request
    const memberDataMap = new Map();
    for (const m of members || []) {
      if (m && (m.key === 'member1' || m.key === 'member2') && typeof m.name === 'string') {
        memberDataMap.set(m.key, {
          key: m.key,
          name: m.name.trim(),
          email: m.email || ''
        });
      }
    }

    // Build new members array
    const newMembers = [];
    
    // Always ensure member1 exists
    if (memberDataMap.has('member1')) {
      newMembers.push(memberDataMap.get('member1'));
    } else {
      // Keep existing member1 if not provided
      const existingMember1 = account.members.find(m => m.key === 'member1');
      if (existingMember1) {
        newMembers.push(existingMember1.toObject());
      }
    }

    // Add member2 if provided
    if (memberDataMap.has('member2')) {
      newMembers.push(memberDataMap.get('member2'));
    } else {
      // Keep existing member2 if not provided but exists
      const existingMember2 = account.members.find(m => m.key === 'member2');
      if (existingMember2) {
        newMembers.push(existingMember2.toObject());
      }
    }

    // Update the account with new members
    account.members = newMembers;
    await account.save();

    return res.json({ id: account._id, members: account.members });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update members', error: err.message });
  }
};
