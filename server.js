const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const sayingsRouter = require("./routes/sayings");
const userRouter = require("./routes/users");
const authRouter = require("./services/auth-router");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.CONNECTION_URL;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

function close() {
  console.log("Disconnected from db");
  return mongoose.disconnect();
}

app.use("/sayings", sayingsRouter);
app.use("/users", userRouter);
app.use("/login", authRouter);

app.listen(port, () => {
  const dbName = 'things_kids_say'
  console.log(`server is runnning on port ${port}`);
  console.log(`Database: ${dbName}`)

});
module.exports = { close };
