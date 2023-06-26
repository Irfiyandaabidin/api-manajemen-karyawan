const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["hr", "supervisor", "employee"],
    default: "employee",
  },
  nik: {
    type: Number,
    minlength: 16,
    maxlength: 16,
    unique: true,
  },
  name: {
    type: String,
  },
  birth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  entry_date: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  image_profile: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
