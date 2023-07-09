// models/user.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const User = require("./Users");

const AccountSchema = new Schema({
  bank_code: {
    type: String,
    required: true,
  },
  nuban: {
    type: String,
    required: true,
  },
  bank_name: String,
  balance: Number,
  external_identifier: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now() },
});

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
