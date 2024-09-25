const express = require("express");
const { authorizeUser } = require("../utils/constants");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const router = express.Router();
router.post("/create", authorizeUser, createTodo);
router.get("/all", authorizeUser, getTodos);
router.put("/update", authorizeUser, updateTodo);
router.delete("/delete", authorizeUser, deleteTodo);
module.exports = router;
