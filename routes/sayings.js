const router = require("express").Router();
const Saying = require("../models/sayings.model");
const auth = require("../services/auth-services");
router.route("/").get((req, res) => {
  Saying.find()
    .then(saying => res.json(saying))
    .catch(err => res.status(400).json("Error:" + err));
});

router.route("/add").post(auth, (req, res) => {
  const kid_name = req.body.kid_name;
  const age = req.body.age;
  const content = req.body.content;

  const newSaying = new Saying({
    kid_name,
    age,
    content
  });
  newSaying
    .save()
    .then(() => res.json(`Quote added with content: "${newSaying.content}"`))
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

    saying
      .save()
      .then(() => res.json("Quote updated"))
      .catch(err => res.status(400).json("Error" + err));
  });
});

module.exports = router;
