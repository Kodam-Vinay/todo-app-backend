require("dotenv").config();
const cors = require("cors");
const express = require("express");
const userRouter = require("./Routes/userRouter");
const todoRouter = require("./Routes/todoRouter");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const port = process.env.PORT | 8000;

app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
