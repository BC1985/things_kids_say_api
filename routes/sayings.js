const router = require("express").Router();
const Saying = require("../models/sayings.model");
const auth = require("../services/auth-services");
router.route("/").get((req, res) => {
  Saying.find()
    .select("kid_name age content username")
    .then(saying => res.json(saying))
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/add").post(auth, (req, res) => {
  const kid_name = req.body.kid_name;
  const age = req.body.age;
  const content = req.body.content;
  const username = res.locals.user.username;
  console.log("username:", username);

  const newSaying = new Saying({
    kid_name,
    age,
    content,
    username,
  });
  newSaying
    .save()
    .then(() =>
      res.json(
        `Quote added with content: "${newSaying.content}" by user ${username}`
      )
    )
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/:id").delete((req, res) => {
  Saying.findByIdAndDelete(req.params.id).then(() => {
    res
      .json("Quote deleted")
      .catch(err => res.status(400).json("Error:" + err));
  });
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
  const filter = { _id: req.params.id };
  const update = {
    kid_name: req.body.kid_name,
    age: req.body.age,
    content: req.body.content,
    username: res.locals.username,
  };
  try {
    const quoteToUpdate = await Saying.findByIdAndUpdate(
      filter,
      update,
      (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res
            .status(200)
            .json({ updatedQuote: result, message: "Updated successfully" });
        }
      }
    );

    console.log(quoteToUpdate);
  } catch (err) {
    res.status(500).json({ Error: err });
    console.log(err);
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
