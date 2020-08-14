const router = require("express").Router();
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const auth = require("./auth-services");

router.route("/").post( async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    console.log(user)
    if (!user) {
      return res.status(401).send({ error: "Login failed" });
    }
    const payload = {
      email: email,
      password: password
     };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
      res.send(accessToken);

    // const userLogin = new User({ email, password });
    // userLogin
    //   .save()
    //   .then(() => res.json(accessToken))
    //   .catch(err => res.status(400).json("Error: " + err));
  } catch (error) {
   res.status(400).json(error)
  }
});

module.exports = router;
