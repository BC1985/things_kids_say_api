const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const validator = require("validator");
const JWT = require("jsonwebtoken");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: value => {
      if (!validator.isEmail(value)) {
        throw new Error({ error: "Invalid email address" });
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});
// hash password before saving
userSchema.pre("save", async function(next) {
  let user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
// search for user by email or password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  const isPasswordMatch = bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};
// compare passwords

userSchema.methods.comparePassword = (password, done) => {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};
userSchema.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  // const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET);
  const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
