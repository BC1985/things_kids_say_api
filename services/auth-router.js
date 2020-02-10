const router = require("express").Router();
const User = require("../models/users.model");
// const JWT = require("jsonwebtoken");
const auth = require("./auth-services");

router.route("/").post(auth, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).send({ error: "Login failed" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });

    // const userLogin = new User({ email, password });
    // const accessToken = JWT.sign({ userLogin }, process.env.JWT_SECRET);
    // userLogin
    //   .save()
    //   .then(() => res.json(accessToken))
    //   .catch(err => res.status(400).json("Error: " + err));
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
