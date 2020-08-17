const router = require("express").Router();
const User = require("../models/users.model");
const auth = require("../services/auth-services");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  User.find()
    .select("email password")
    .then(saying => res.json(saying))
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/add").post(async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({
      email,
      password,
    });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // save password in DB as hashed
    newUser.password = passwordHash;
    // get token on signup
    const payload = { email:email, password: password };
    const token = await jwt.sign(payload, process.env.JWT_SECRET)
    // Save user to DB
    newUser
    .save()
    .then(() => res.json({ message:`User with email '${newUser.email}' added`, token: token }))
      .catch(err => res.status(400).json("Error:" + err));
  } catch (error) {
    res.status(500).send(error);
  }
});
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    // .select("email")
    // .exec((err, doc) => {
    //   if (err || doc === null) {
    //     res.status(404).json({ error: "person not found" });
    //   } else {
    //     return json(doc);
    //   }
    // })
    .then(user => {
      res.json(user).catch(err => res.status(400).json("Error:" + err));
    });
});
router.route("/:id").delete((req, res) => {
  const email = req.body.email;
  User.findByIdAndDelete(req.params.id).then(() => {
    res
      .json(`User with email '${email}' deleted`)
      .catch(err => res.status(400).json("Error:" + err));
  });
});
router.route("/update/:id").put((req, res) => {
  User.findById(req.params.id).then(user => {
    user.kid_name = req.body.email;
    user.age = req.body.password;

    user
      .save()
      .then(() => res.json(`User with email '${newUser.email}' updated`))
      .catch(err => res.status(400).json("Error" + err));
  });
});

module.exports = router;
