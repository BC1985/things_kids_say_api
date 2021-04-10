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
const quote = new Saying({
  kid_name: "name",
  age: 4,
  content: "test content",
});
describe("GET/sayings", () => {
  before(done => {
    connectionObj.then(() => done()).catch(err => console.log(err));
  });
  // beforeEach(done => {
  //   mongoose.connection.collections.sayings.drop(() => {
  //     done();
  //   });
  // });

  it("Gets quotes and returns status code 200", done => {
    chai
      .request(app)
      .get("/sayings")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        done();
      });
  });
  it("Should NOT get all quotes", done => {
    chai
      .request(app)
      .get("/wrong")
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
describe("GET/sayings/:id", () => {
  before(done => {
    connectionObj.then(() => done()).catch(err => console.log(err));
  });

  it("Should get quote by ID", done => {
    quote.save();
    chai
      .request(app)
      .get(`/sayings/${quote._id}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("_id");
        res.body.should.have.property("kid_name");
        done();
      });
  });

  it("Should get error if wrong ID", done => {
    chai
      .request(app)
      .get(`/sayings/${quote._id}1234`)
      .end((err, res) => {
        res.should.have.status(500);
        res.text.should.be.eq('"Error retrieving quote"');
        done();
      });
  });
});

// after(done => {
//   mongoose.connection.collections.sayings.drop(() => {
//     done();
//   });
// });

describe("POST/sayings/add", () => {
  before(done => {
    connectionObj.then(() => done()).catch(err => console.log(err));
  });
  it("Return 401 if unauthorized to post",(done)=>{
    chai
    .request(app)
    .post("/sayings/add")
    .send(quote)
    .end((err, res) => {
      console.log(res.text)
      res.should.have.status(401);
      res.text.should.be.eq('Access was denied');     
      done();
    });
  })
})


// it("gets quote by ID", done => {
// const quote = new Saying({
//   kid_name: "name",
//   age: 4,
//   content: "test content",
// });
//   quote.save()

//   chai.request('http://localhost:5000').get('/sayings')
// chai.request("http://localhost:5000/").get("/sayings").then(

// )
// search by i
// .then(q=>{
//   if (quote.id===12345) {
//     return q
//   }
//   console.log(q)
// })
// done();
// if quote is found return 200
// });
// });

// describe("POST/sayings/add", done => {
//   const quote = new Saying({
//     kid_name: "test name",
//     age: 4,
//     content: "test content",
//   });
//   before(done => {
//     connectionObj.then(() => done()).catch(err => console.log(err));
//   });
//   beforeEach(done => {
//     mongoose.connection.collections.sayings.drop(() => {
//       done();
//     });
//   });
//   it.only("Posts new quote", () => {
//     quote.save().then(() => {
//       assert(!quote.isNew);
//       done();
//     });
//   });
// });

// describe("Delete/sayings/:id", done => {
//   const quote = new Saying({
//     kid_name: "test name",
//     age: 4,
//     content: "test content",
//   });
//   beforeEach(() => {
//     mongoose.connection.collections.sayings.drop(() => {});
//   });
//   quote.save();
//   // remove quote
//   it("Removes quote", () => {
//     Saying.deleteOne({
//       kid_name: "test name",
//       age: 4,
//       content: "test content",
//     }).then(quote => {
//       assert(quote === null).done();
//     });
//   });

//   // remove by id
//   it("Removes quote using id", done => {
//     Saying.findByIdAndRemove(quote._id).then(quote => {
//       assert(quote === null);
//     });
//     done();
//   });
// });
// update routes
// describe("Update/sayings/:id", done => {
//   beforeEach(() => {
//     const quote = new Saying({
//       kid_name: "test name",
//       age: 4,
//       content: "test content",
//     });
//     quote.save().then(() => done());
//   });
//   // update by parameter
//   it("Sets and saves quote using an instance", done => {
//     Saying.update({ content: "new test content" });
//     done();
//   });
//   // update using model method
//   it("Updates one quote using model", done => {
//     Saying.findOneAndUpdate(
//       { content: "test content" },
//       { content: "new test content" }
//     );
//     done();
//   });
//   // update by id
//   it("Updats quotes using id", done => {
//     const quote = new Saying({
//       kid_name: "test name",
//       age: 4,
//       content: "test content",
//     });
//     Saying.findByIdAndUpdate(quote._id, {
//       content: "new content"
//     });
//     done();
//   });
// });
