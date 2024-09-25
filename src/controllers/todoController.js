const initializeDb = require("../db/connection");

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

const updateTodo = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
  const { id, title, description } = req.body;
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.body;
    const db = await initializeDb();
    const findTododQuery = `SELECT * FROM todos WHERE id=${id}`;
    const dbTodo = await db.get(findTododQuery);
    if (!dbTodo) {
      return res.status(404).send({ status: false, message: "Todo not found" });
    }
    const deleteTodoQuery = `DELETE FROM todos WHERE id=${id}`;
    await db.run(deleteTodoQuery);
    res
      .status(200)
      .send({ status: true, message: "Todo Deleted Successfully" });
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

const getTodos = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const getTodosQuery = `SELECT * FROM todos WHERE user_id='${userDetails?.user_id}'`;
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

module.exports = {
  createTodo,
  updateTodo,
  deleteTodo,
  getTodos,
};
