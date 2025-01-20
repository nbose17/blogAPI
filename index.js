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
const { sequelize } = require("./db/index"); // Import Sequelize and models

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Sync models with the database
sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error synchronizing the database:", err);
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

module.exports = app;
