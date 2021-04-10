const Saying = require("../../models/sayings.model");
const mongoose = require("mongoose");
require("dotenv").config();
const { app } = require("../../server");

// const assert = require("assert");
const chai = require("chai");
// const expect = require("chai").expect;
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

const test_uri = process.env.CONNECTION_URI_TEST;

const connectionObj = mongoose.connect(test_uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const users = [
  {
    username: "new user1",
    email: "email@123.com",
    password: "Password1234!",
  },
  {
    username: "new user2",
    email: "email@1234.com",
    password: "Password1234@",
  },
  {
    username: "new user3",
    email: "email@789.com",
    password: "Password1234$",
  },
];

describe("POST/users", () => {
  before(done => {
    connectionObj.then(() => done()).catch(err => console.log(err));
  });
  beforeEach(done => {
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });
  it("Register new user", done => {
    chai
      .request(app)
      .post("/users/add")
      .send(users[0])
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

describe("GET/users", done => {
  it("Should get all users with status code 200", done => {
    chai
      .request(app)
      .get("/users")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });

  it("Should NOT get users if not authorized", done => {
    chai
      .request(app)
      .get(`/users/${users[0]._id}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.text.should.be.eq("Access was denied");
        done();
      });
  });
});
