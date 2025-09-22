'use strict';

const { Schema, model } = require('mongoose');

const UserCredentialSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true, collection: 'user_credentials' }
);

module.exports = model('UserCredential', UserCredentialSchema);

