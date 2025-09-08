import express from "express";
import pool from "../db.js"; 
const router = express.Router();
import bcrypt from "bcrypt";


// Register endpoint
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  try {
    // Check if email or username already exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email or username already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user into database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword] // Later we will hash the password
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
  
});

export default router;
