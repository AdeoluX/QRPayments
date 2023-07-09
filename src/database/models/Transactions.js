// models/user.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reference: String,
  type: {
    type: String,
    enum: ["DR", "CR"],
  },
  module: {
    type: String,
    enum: ["QR", "TRSF"],
  },
  status: {
    type: String,
    enum: ["success", "failed", "pending", "processing"],
  },
  qr_hash: String,
  currency: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  store: { type: Schema.Types.ObjectId, ref: "Store" },
  meta: String,
  created_at: { type: Date, default: Date.now() },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;
