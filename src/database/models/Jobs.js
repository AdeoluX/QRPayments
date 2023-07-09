// models/user.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const JobSchema = new Schema({
  log: {
    type: String,
  },
  status: {
    type: String,
    enum: ["failed", "succeeded"],
  },
  created_at: { type: Date, default: Date.now() },
});

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
