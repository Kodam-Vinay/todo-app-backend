require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authorizeUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ status: false, message: "Invalid token" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .send({ status: false, message: "Unauthorized User" });
  }
};

const generateJwtToken = (userDetails) => {
  return jwt.sign({ userDetails }, process.env.JWT_SECRET_KEY);
};

const generateHashPassword = async (password) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

module.exports = {
  generateJwtToken,
  authorizeUser,
  generateHashPassword,
};
