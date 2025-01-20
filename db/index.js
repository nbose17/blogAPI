const { Sequelize, DataTypes } = require("sequelize");
const dbConfig = require("../config/db.config");

//Sequelize Config
const sequelize = new Sequelize(dbConfig.storage, "", "", {
  dialect: dbConfig.dialect,
  logging: false, // Turn off SQL query logging
});

// Check if the connection is successful
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

//Models
const Blog = sequelize.define("Blog", {
  title: DataTypes.STRING,
  message: DataTypes.STRING,
  author: DataTypes.INTEGER,
  author_name: DataTypes.STRING,
});

const User = sequelize.define("User", {
  full_name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = {
  Blog,
  User,
  sequelize,
};
