const express = require("express");
const router = express.Router();
const User = require("../db/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  User.find();
  res.sendStatus(200);
});

const generateAccessJWT = function (id) {
  let payload = {
    id: id,
  };
  return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "20m",
  });
};

router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if User exists
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({
        status: "failed",
        data: [],
        message: "Account does not exist",
      });

    // if User exists
    // validate password
    const isPasswordValid = bcrypt.compare(
      `${req.body.password}`,
      user.password
    );

    // if not valid, return unathorized response
    if (!isPasswordValid)
      return res.status(401).json({
        status: "failed",
        data: [],
        message:
          "Invalid email or password. Please try again with the correct credentials.",
      });

    let options = {
      maxAge: 20 * 60 * 1000, // would expire in 20minutes
      httpOnly: true, // The cookie is only accessible by the web server
      secure: true,
      sameSite: "None",
    };
    const token = generateAccessJWT(user._id); // generate session token for User
    res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
    res.status(200).json({
      status: "success",
      message: "You have successfully logged in.",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
  res.end();
});

router.post("/register", async (req, res) => {
  try {
    if (!req.body.full_name) {
      res.send(400).json({
        status: false,
        message: "Please enter full name",
      });
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
    await User.create(req.body);
    return res.status(200).json({
      status: "success",
      message: "User created successfully.",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      code: 500,
      data: [],
      message: "Internal Server Error",
    });
  }
  res.end();
});

module.exports = router;
