require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const auth = require("./services/auth");
const blog = require("./services/blog");
const bodyparser = require("body-parser");
const cors = require("cors");
const { default: verifyToken } = require("./helpers/helpers");

const app = express();
const port = 3001;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());

//Mongo DB Config
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7tsliqt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    console.log("Database is connected!!");
  })
  .catch(() => {
    console.log("DB Connection Failed!!");
  });

app.get("/", (req, res) => {
  res.send(200);
});

app.use("/api/auth", auth);
app.use("/api/blog", blog);

app.listen(port, () => {
  console.log(`Blog API service listening on port ${port}`);
});
