require("dotenv").config();
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");
const { v4: uniqueId } = require("uuid");
const initializeDb = require("../db/connection");
const {
  generateJwtToken,
  generateHashPassword,
} = require("../utils/constants");

const registerUser = async (req, res) => {
  try {
    const { email, name, password, confirmPassword } = req.body;

    if (!email || !name || !password || !confirmPassword) {
      return res
        .status(400)
        .send({ status: false, message: "Please fill in all fields" });
    }
    if (!isEmail(email)) {
      return res.status(400).send({ status: false, message: "Invalid email" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ status: false, message: "Passwords do not match" });
    }

    const db = await initializeDb();

    const findUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
    const dbUser = await db.get(findUserQuery);

    if (dbUser) {
      return res
        .status(400)
        .send({ status: false, message: "User already exists" });
    }

    const hashedPassword = await generateHashPassword(password);
    const userId = uniqueId();
    const createNewUserQuery = `INSERT INTO users (id, email, name, password) VALUES ('${userId}','${email}', '${name}', '${hashedPassword}')`;
    await db.run(createNewUserQuery);

    const newUserDetails = await db.get(findUserQuery);

    const userDetails = {
      email: newUserDetails?.email,
      name: newUserDetails?.name,
      user_id: newUserDetails?.id,
    };
    const token = generateJwtToken(userDetails);
    const sendDetails = {
      email: newUserDetails?.email,
      name: newUserDetails?.name,
      token,
    };
    res.status(201).send({
      status: true,
      message: "User created successfully",
      data: {
        userDetails: sendDetails,
      },
    });
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Please fill in all fields" });
    }

    const db = await initializeDb();

    const findUserQuery = `SELECT * FROM users WHERE email = '${email}'`;
    const dbUser = await db.get(findUserQuery);

    if (!dbUser) {
      return res.status(404).send({ status: false, message: "User not found" });
    }
    const comparePassword = bcrypt.compare(password, dbUser?.password);
    if (!comparePassword) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid password" });
    }
    const userDetails = {
      email: dbUser?.email,
      name: dbUser?.name,
      user_id: dbUser?.id,
    };
    const token = generateJwtToken(userDetails);
    const sendDetails = {
      name: dbUser?.name,
      email: dbUser?.email,
      token,
    };
    res.status(200).send({
      status: true,
      message: "Login Successful",
      data: {
        userDetails: sendDetails,
      },
    });
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userDetails } = req.user;

    const { email, name, password } = req.body;

    const db = await initializeDb();

    const findUserQuery = `SELECT * FROM users WHERE id = '${userDetails?.user_id}'`;
    const dbUser = await db.get(findUserQuery);

    if (!dbUser) {
      return res.status(404).send({ status: false, message: "User not found" });
    }

    const findEmailExistsQuery = `SELECT * FROM users WHERE email='${email}'`;
    const findDbUserEmailExists = await db.get(findEmailExistsQuery);
    if (
      findDbUserEmailExists &&
      findDbUserEmailExists?.email !== userDetails?.email
    ) {
      return res
        .status(404)
        .send({ status: false, message: "Email Already Exists" });
    }

    let hashedPassword = "";
    if (password) {
      hashedPassword = await generateHashPassword(password);
    } else {
      hashedPassword = dbUser.password;
    }

    const updateUserQuery = `UPDATE users SET name='${name}', password='${hashedPassword}', email='${email}' WHERE id='${userDetails?.user_id}'`;
    await db.run(updateUserQuery);

    const dbUserAfterUpdateQuery = `SELECT * FROM users WHERE id = '${userDetails?.user_id}'`;
    const dbUserAfterUpdate = await db.get(dbUserAfterUpdateQuery);
    const tokenUserDetails = {
      email: dbUserAfterUpdate?.email,
      name: dbUserAfterUpdate?.name,
    };
    const token = generateJwtToken(tokenUserDetails);
    const sendDetails = {
      name: dbUserAfterUpdate?.name,
      email: dbUserAfterUpdate?.email,
      token,
    };

    res.status(200).send({
      status: true,
      message: "User Details Update Successful",
      data: {
        userDetails: sendDetails,
      },
    });
  } catch (error) {
    res.status(500).send({ status: false, message: "Something went wrong" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
};
