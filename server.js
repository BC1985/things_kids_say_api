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

const uri = process.env.CONNECTION_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connected succefully");
});

app.use("/sayings", sayingsRouter);
app.use("/users", userRouter);
app.use("/login", authRouter);

app.listen(port, () => {
  console.log(`server is runnning on port ${port}`);
});
