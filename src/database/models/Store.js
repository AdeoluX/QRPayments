// models/user.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const StoreSchema = new Schema({
  store_name: {
    type: String,
    required: true,
  },
  rc_number: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["verified", "unverified"],
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  items: [{ type: Schema.Types.ObjectId, ref: "StoreItem" }],
  created_at: { type: Date, default: Date.now() },
});

const Store = mongoose.model("Store", StoreSchema);

module.exports = Store;
