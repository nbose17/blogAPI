const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  member_id: {
    type: String,
    default: "MEMB" + new Date().getTime(),
  },
  referral_member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  full_name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  address: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  payment_status: {
    type: String,
    enum: ["success", "failed", "pending"],
  },
  payment_amount: {
    type: Number,
  },
  otp: {
    type: Number,
    default: Math.floor(100000 + Math.random() * 900000),
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
