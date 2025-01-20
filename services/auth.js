const express = require("express");
const router = express.Router();
const { User } = require("../db/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  User.find();
  res.sendStatus(200);
});

const generateAccessJWT = function (id, name) {
  let payload = {
    id: id,
    name: name,
  };
  return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: "20m",
  });
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token for authentication.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Invalid email or password
 *       500:
 *         description: Server error
 *
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user with full name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 description: The user's full name.
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The user's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       201:
 *         description: Successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of registration.
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                   example: "User created successfully."
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Conflict - Email already exists
 *       500:
 *         description: Server error
 */

router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if User exists
    const user = await User.findOne({ where: { email: email } });

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
    const token = generateAccessJWT(user.id, user.full_name); // generate session token for User
    res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
    res.status(200).json({
      status: "success",
      message: "You have successfully logged in.",
      token: token,
    });
  } catch (err) {
    console.log(err);
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
    console.log(err, "REGISTER");
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
