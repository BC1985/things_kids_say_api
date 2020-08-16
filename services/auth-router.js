const router = require("express").Router();
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.route("/").post( async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(400).send("Cannot find user");
    } else {
      const payload = {
        email: email,
        password: password
      };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        res.json(accessToken);
      } else {
        res.status(400).json({ error: "password don't match" });
      }
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
