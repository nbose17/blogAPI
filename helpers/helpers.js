const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Get the Authorization header
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token after 'Bearer'

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // Attach decoded payload to the request object
    next(); // Proceed to the next middleware or route
  });
};

module.exports = verifyToken;
