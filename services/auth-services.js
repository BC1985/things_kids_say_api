const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
  // find token in headers
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Access was denied");
  } else {
    // validate token
    const tokenBody = token && token.split(" ")[1];

    jwt.verify(tokenBody, process.env.JWT_SECRET, async (err, decoded) => {
      // return error if token is invalid
      if (err) {
        console.log(`JWT error: ${err}`);
        return res.status(401).json({ Error: err.message });
      } else {
        let user = await User.findOne({ email: decoded.email });
        res.locals.user = user;
        next();
        return user
      }
    });
  }
  //     const isMatch = await user.isPasswordValid(password)
  // // const isPasswordMatch = bcrypt.compare(user.password, user.password);
  // if (!isMatch) {
  //   throw new Error({ error: "Invalid login credentials" });
  // }else{
  //   return user
  // }
};

// try {
//   const user = await User.findOne({ _id: data._id, "tokens.token": token });
//   if (!user) {
//     throw new Error();
//   }

//   req.user = user;
//   req.token = token;
//   next();
// } catch (error) {
//   res.status(401).send({ error: "Not authorized" });
// }

// const authApiServices = {
//   comparePasswords(password, hash) {
//     return bcrypt.compare(password, hash);
//   },
//   createJwt(subject, payload) {
//     return jwt.sign(payload, process.env.JWT_SECRET, {
//       subject,
//       expiresIn: "1h",
//       algorithm: "HS256"
//     });
//   }
// };

module.exports = auth;
