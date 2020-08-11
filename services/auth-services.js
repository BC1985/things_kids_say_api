const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
  console.log(req.headers);
  // find token in headers
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Access was denied");
  } else 
  {
    // validate token
    const tokenBody = token && token.split(" ")[1];
    console.log('TOKEN BODY--',tokenBody);
    
    jwt.verify(tokenBody, process.env.JWT_SECRET, (err,decoded)=>{
      if(err){
        console.log(`JWT error: ${err}`);
        return res.status(401).send('access denied, yo')
      }
      next();
    });
  }
  const payload = {
    email: "123@email.com",
  };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
  res.send(accessToken);
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
