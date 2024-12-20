const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

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

    if (account.password !== password) {
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
      role: account.role,
    });
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

module.exports = { login, verifyToken };
