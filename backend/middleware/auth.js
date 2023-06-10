const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    next();
  }
};

module.exports = verifyToken;
