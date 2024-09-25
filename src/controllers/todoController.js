const { v4: uniqueId } = require("uuid");
const initializeDb = require("../db/connection");

const createTodo = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).send({
        status: false,
        message: "Please provide both title and description",
      });
    }
    const db = await initializeDb();

    const todoId = uniqueId();
    const createTodoQuery = `INSERT INTO todos(id, title, description, user_id) VALUES('${todoId}', '${title}', '${description}', '${userDetails?.user_id}')`;
    await db.run(createTodoQuery);
    res.status(201).send({
      status: true,
      message: "Todo created successfully",
    });
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const { id, title, description, status } = req.body;
    console.log(status);
    if (!id || !title || !description || !status) {
      res
        .status(400)
        .send({ status: false, message: "Fields should not be empty" });
    }
    const db = await initializeDb();
    const findTododQuery = `SELECT * FROM todos WHERE id='${id}'`;
    const dbTodo = await db.get(findTododQuery);
    if (!dbTodo) {
      return res.status(404).send({ status: false, message: "Todo not found" });
    }
    if (userDetails?.user_id !== dbTodo?.user_id) {
      return res
        .status(404)
        .send({ status: false, message: "Your Not Allowed to Update Todo" });
    }
    const updateTodoQuery = `UPDATE todos SET title='${title}', description='${description}', status='${status}' WHERE id='${id}'`;
    await db.run(updateTodoQuery);
    res.status(200).send({
      status: true,
      message: "Todo Updated Successfully",
    });
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { userDetails } = req.user;
    const { id } = req.body;
    const db = await initializeDb();
    const findTododQuery = `SELECT * FROM todos WHERE id='${id}'`;
    const dbTodo = await db.get(findTododQuery);
    if (!dbTodo) {
      return res.status(404).send({ status: false, message: "Todo not found" });
    }
    if (userDetails?.user_id !== dbTodo?.user_id) {
      return res
        .status(404)
        .send({ status: false, message: "Your Not Allowed to Delete Todo" });
    }
    const deleteTodoQuery = `DELETE FROM todos WHERE id='${id}'`;
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
    const db = await initializeDb();
    const todos = await db.all(getTodosQuery);
    res
      .status(200)
      .send({ status: true, message: "Todos Retrieved", data: todos });
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
