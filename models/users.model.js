const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");
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
      message:
        "Password must include uppercase, lowecase, numbers and symbols without spaces",
    },
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ password: password, email: email });
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};
// hash password before saving to database
userSchema.pre("save", async function (next) {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(this.password, salt);
  // save password in DB as hashed
  this.password = passwordHash;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
