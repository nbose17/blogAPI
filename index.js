require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const auth = require("./services/auth");
const blog = require("./services/blog");
const bodyparser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3001;
const { swaggerUi, swaggerSpec } = require("./swagger");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

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

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use("/api/auth", auth);
app.use("/api/blog", blog);

// Catch all routes and serve static files from public directory
app.use("*", express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log(`Blog API service listening on port ${port}`);
});
