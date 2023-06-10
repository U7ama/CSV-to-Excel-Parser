const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const pool = require("../config/db");
const router = express.Router();

//Session and token based authentication
router.post("/login", async (req, res) => {
  const { username, password, rememberMe } = req.body;

  try {
    // Retrieve user from the database
    const connection = await pool.promise().getConnection();
    const [rows] = await connection.execute(
      "SELECT name, password FROM users WHERE name = ?",
      [username]
    );

    if (rows.length === 0) {
      console.log("No user found");
      return res.sendStatus(401);
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Passwords do not match");
      return res.sendStatus(401);
    }

    // if remember me checked user keep user logged in with jwt token
    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: rememberMe ? "365d" : "1h",
      }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.sendStatus(500);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
});

module.exports = router;
