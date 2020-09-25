const router = require("express").Router();
const User = require("../models/users.model");
const auth = require("../services/auth-services");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  User.find()
    .select("email password username")
    .then(saying => res.json(saying))
    .catch(err => res.status(400).json("Error:" + err));
});
router.route("/current-user").get(auth, (req, res, next) => {
  res.json(res.locals.user);
});

router.route("/add").post(async (req, res) => {
  // handle errors
  const handleErrors = err => {
    console.log(err.message, err.code);

    let errors = { email: "", password: "", username: "" };
    // validation errors
    if (err.message.includes("User validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
    return errors;
  };
  try {
    const { email, password, username } = req.body;
    const newUser = await User({
      email,
      password,
      username,
    });
    await newUser.validate();
    // // throw error if user alreday in db
    // const userExists = await User.findOne({ email });
    // if (userExists) {
    //   res.status(400).json({ error: "user already exists" });
    // }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // save password in DB as hashed
    newUser.password = passwordHash;
    // get token on signup
    const payload = { email: email, password: password };
    const token = await jwt.sign(payload, process.env.JWT_SECRET);
    // Save user to DB
    newUser.save(err => {
      console.log(err);
    });
    res.json({
      message: `User with email '${newUser.email}' added`,
      token: token,
    });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ errors });
  }
});
router.route("/:id").get(auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
  // .select("email")
  // .exec((err, doc) => {
  //   if (err || doc === null) {
  //     res.status(404).json({ error: "person not found" });
  //   } else {
  //     return json(doc);
  //   }
  // })
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
