const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//loading env variables
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

const SECRET_KEY = 'thisISAKey6546156';
const SALT_ROUNDS = 10;

// Login route
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
    const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const account = result.rows[0];

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }

    const token = jwt.sign(
      { username: account.username, name: account.name, role: account.role },
      SECRET_KEY
    );

    res.json({
      success: true,
      token,
      name: account.name,
      username: account.username,
      role: account.role,
      organisation: account.organisation,
      id: account.id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { token, oldPassword, newPassword } = req.body;

  if (!token || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const username = decoded.username;

    const result = await pool.query('SELECT * FROM accounts WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const account = result.rows[0];

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, account.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update password in database
    await pool.query('UPDATE accounts SET password = $1 WHERE username = $2', [hashedPassword, username]);

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

// Token verification route
const verifyToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    res.json({
      success: true
    });
  });
};

module.exports = { login, verifyToken, changePassword };
