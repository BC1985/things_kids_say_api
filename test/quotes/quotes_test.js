const Saying = require("../../models/sayings.model");
const conn = require("../../server");
const mongoose = require("mongoose");
require("dotenv").config();

const assert = require("assert");
const test_uri = process.env.CONNECTION_URI_TEST;
const connectionObj = mongoose.connect(test_uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
describe("POST/sayings/add", done => {
  const quote = new Saying({
    kid_name: "test name",
    age: 4,
    content: "test content"
  });
  before(() => {
    connectionObj.then(() => done()).catch(err => done(err));
  });
  beforeEach(() => {
    mongoose.connection.collections.sayings.drop(() => {
      done();
    });
  });
  after(() => {
    conn
      .close()
      .then(() => done())
      .catch(err => done(err));
  });
  it("Posts new quote", () => {
    quote.save().then(() => {
      assert(!quote.isNew);
      done();
    });
  });
});

describe("Delete/sayings/:id", done => {
  const quote = new Saying({
    kid_name: "test name",
    age: 4,
    content: "test content"
  });
  beforeEach(() => {
    mongoose.connection.collections.sayings.drop(() => {
      done();
    });
  });
  quote.save();
  // remove quote
  it("Removes quote", () => {
    Saying.deleteOne({
      kid_name: "test name",
      age: 4,
      content: "test content"
    }).then(quote => {
      assert(quote === null).done();
    });
  });
  // remove by id
  it("Removes quote using id", done => {
    Saying.findByIdAndRemove(quote._id).then(quote => {
      assert(quote === null);
    });
    done();
  });
});
// update routes
describe("Update/sayings/:id", done => {
  beforeEach(() => {
    const quote = new Saying({
      kid_name: "test name",
      age: 4,
      content: "test content"
    });
    quote.save().then(() => done());
  });
  // update by parameter
  it("Sets and saves quote using an instance", done => {
    Saying.update({ content: "new test content" });
    done();
  });
  // update using model method
  it("Updates one quote using model", done => {
    Saying.findOneAndUpdate(
      { content: "test content" },
      { content: "new test content" }
    );
    done();
  });
  // update by id
  it("Updats quotes using id", done => {
    const quote = new Saying({
      kid_name: "test name",
      age: 4,
      content: "test content"
    });
    Saying.findByIdAndUpdate(quote._id, {
      content: "new test content"
    });
    done();
  });
});