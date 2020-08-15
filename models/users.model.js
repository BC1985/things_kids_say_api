const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");
const JWT = require("jsonwebtoken");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [isEmail, "Please enter valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Must be at least six characters"],
    maxlength: [72, "Password cannot be more that 72 characters long"],
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ password: password, email: email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
