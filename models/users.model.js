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
        throw new Error( "Invalid email address");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Must be at least six characters'],
    maxlength: [72, 'Password cannot be more that 72 characters long' ]
  }
});
  // hash password before saving
userSchema.pre("save", async (next) =>{
  try{
    let user = this;
    // Generate salt
   const salt= await bcrypt.genSalt(10);
  //  Generate passord hash
   const passwordHash = await bcrypt.hash(user.password, salt)
  // assign password to hashed version
  user.password  = passwordHash;
    // const isMatch = await bcrypt.compare(passwordHash, user.password);
    // if (!isMatch) {
    //     throw new Error({ error: "Invalid login credentials" });
    // } 
  next()
  }
  catch(error){
    next(error);
  }

});

// userSchema.method('isPasswordValid', async (newPassword)=>{
//   try { 
//    return await bcrypt.compare(newPassword, user.password)
//   } catch (error) {
//     throw new Error(error)
//   }
// })
// search for user by email or password
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({password: password, email: email});
  if (!user) {
    throw new Error({ error: "Invalid login credentials" });
  }
  return user;
};
// compare passwords

// const isMatch = userSchema.isPasswordValid(password)
// const isPasswordMatch = bcrypt.compare(user.password, user.password);
// if (!isPasswordMatch) {
//   throw new Error({ error: "Invalid login credentials" });
// }else{
//   return user
// }
 
// userSchema.methods.comparePassword = (password, done) => {
//   bcrypt.compare(password, this.password, (err, isMatch) => {
//     done(err, isMatch);
//   });
// };
const User = mongoose.model("User", userSchema);
module.exports = User;
