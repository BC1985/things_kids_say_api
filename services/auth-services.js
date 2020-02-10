const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const user = await User.findOne({ _id: data._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authorized" });
  }
};
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
