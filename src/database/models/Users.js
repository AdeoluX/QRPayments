// models/user.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  activated: { type: Boolean, default: false },
  phonenumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
  },
  user_type: {
    type: String,
    enum: ["store_owner", "user"],
  },
  bvn: String,
  account: { type: Schema.Types.ObjectId, ref: "Account" },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
