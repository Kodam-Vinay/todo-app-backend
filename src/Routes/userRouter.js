const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
} = require("../controllers/userController");
const { authorizeUser } = require("../utils/constants");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", authorizeUser, updateUser);
module.exports = router;
