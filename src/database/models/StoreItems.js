// models/user.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const StoreItemSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: String,
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  currency: {
    type: String,
    enum: ["NGN", "USD"],
  },
  image: String,
  store: { type: Schema.Types.ObjectId, ref: "Store" },
  created_at: { type: Date, default: Date.now() },
});

const StoreItem = mongoose.model("StoreItem", StoreItemSchema);

module.exports = StoreItem;
