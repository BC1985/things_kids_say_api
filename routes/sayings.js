const router = require("express").Router();
const Saying = require("../models/sayings.model");
const auth = require("../services/auth-services");
const handleErrors = require("../services/error.handler");

router.route("/").get((req, res) => {
  Saying.find()
    .select("kid_name age content username")
    .then(saying => res.json(saying))
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/add").post(auth, async (req, res) => {
  try {
    const newSaying = new Saying({
      kid_name: req.body.kid_name,
      age: req.body.age,
      content: req.body.content,
      username: res.locals.user.username,
    });
    await newSaying.validate();
    await newSaying.save();
    res.json(`Quote added with content: "${newSaying.content}`);
  } catch (error) {
    let errors = handleErrors(error);
    res.status(500).json({ errors });
  }
});

router.route("/:id").delete(async (req, res) => {
  try {
    await Saying.findByIdAndDelete(req.params.id);
    res.status(200).json("Quote successfully deleted.");
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
});
router.route("/:id").get(async (req, res) => {
  try {
    const data = await Saying.findById(req.params.id).select(
      "kid_name age content"
    );
    return res.status(200).json(data);
  } catch (err) {
    res.status(500).json("Error retrieving quote");
  }
});

router.route("/update/:id").put(auth, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    const update = {
      kid_name: req.body.kid_name,
      age: req.body.age,
      content: req.body.content,
    };
    await Saying.validate(update);
    await Saying.findByIdAndUpdate(filter, update, err => {
      if (err) {
        let errors = handleErrors(err);
        res.status(500).json(errors);
      } else {
        res
          .status(200)
          .json({ updatedQuote: update, message: `Updated successfully` });
      }
    });
  } catch (error) {
    let errors = handleErrors(error);
    res.status(500).json({ errors });
  }
});
router.route("/users/:id").get(auth, async (req, res, next) => {
  let user = res.locals.user.username;
  let id = res.locals.user._id;

  const data = await Saying.find({ username: user });
  try {
    if (req.params.id == id) {
      res.status(200).json(data);
    } else {
      res.status(401).json({ Error: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
