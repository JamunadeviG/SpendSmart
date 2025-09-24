'use strict';

const { Schema, model, Types } = require('mongoose');

const MemberSchema = new Schema(
  {
    key: { type: String, enum: ['member1', 'member2'], required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true }
  },
  { _id: false }
);

const FamilyAccountSchema = new Schema(
  {
    owner: { type: Types.ObjectId, ref: 'UserCredential', required: true },
    members: {
      type: [MemberSchema],
      validate: {
        validator: function (arr) {
          if (!Array.isArray(arr) || arr.length < 1 || arr.length > 2) return false;
          // must include member1 always
          const keys = arr.map(m => m.key);
          if (!keys.includes('member1')) return false;
          // if two members, keys must be unique and include member2
          if (arr.length === 2) {
            const set = new Set(keys);
            if (set.size !== 2) return false;
            if (!keys.includes('member2')) return false;
          }
          return true;
        },
        message: 'Family account must have member1, and optionally member2.'
      }
    }
  },
  { timestamps: true, collection: 'family_accounts' }
);

module.exports = model('FamilyAccount', FamilyAccountSchema);
