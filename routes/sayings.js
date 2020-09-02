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
router.route("/:id").get((req, res) => {
  Saying.findById(req.params.id).then(quote => {
    res.json(quote).catch(err => res.status(400).json("Error:" + err));
  });
});

router.route("/update/:id").put((req, res) => {
  Saying.findById(req.params.id).then(saying => {
    saying.kid_name = req.body.kid_name;
    saying.age = req.body.age;
    saying.content = req.body.content;
    // saying.username = res.locals.user.username;

    saying
      .save()
      .then(() => res.json("Quote updated"))
      .catch(err => res.status(400).json("Error" + err));
  });
});

module.exports = router;
