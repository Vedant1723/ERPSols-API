const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No Token, Authorization Denied!" });
  }
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.teacher = decoded.teacher;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not Valid!" });
  }
};
