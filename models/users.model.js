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
    required: [true, "Password required"],
    minlength: [6, "Must be at least six characters"],
    maxlength: [72, "Password cannot be more that 72 characters long"],
    validate: {
      validator: val => {
        var regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\S]+/;
        return val == null || val.trim().length < 1 || regex.test(val);
      },
      message: "Password invalid.",
    },
    // /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\S]+/
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
