const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
// custom message for unique email validation
mongoose.plugin(require("mongoose-unique-validator"), {
  message: "Email already registered",
});

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter email"],
    validate: [isEmail, "Please enter valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Must be at least six characters"],
    maxlength: [72, "Password cannot be more that 72 characters long"],
    validate: {
      validator: val => {
        let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\S]+/;
        return val == null || val.trim().length < 1 || regex.test(val);
      },
      message: "Password must include uppercase, lowecase, numbers and symbols without spaces",
    },
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
