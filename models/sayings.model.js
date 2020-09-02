const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sayingsSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  kid_name: { type: String, required: true },
  age: { type: Number, required: true },

  username: {
    type: String
  }
});
const saying = mongoose.model("Saying", sayingsSchema);
module.exports = saying;
