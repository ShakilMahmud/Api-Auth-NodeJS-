const jwt = require("jsonwebtoken");

// Middleware function to verify the token
module.exports = function verifyToken(req, res, next) {
  // Get the token from the request headers
  const token = req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res.status(401).send("Invalid token");
  }

  // Verify the token using the secret key
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Unauthorized access.");
  }
}