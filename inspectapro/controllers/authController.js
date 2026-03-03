const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// Register function
const register = async (req, res) => {
  const { customer_name, email_contact, c_password, phone, address } = req.body;

  if (!customer_name || !email_contact || !c_password || !phone || !address) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM customers WHERE email_contact = ?', [email_contact]);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(c_password, 10);

    const [result] = await pool.query(
      'INSERT INTO customers (customer_name, email_contact, c_password, phone, address) VALUES (?, ?, ?, ?, ?)',
      [customer_name, email_contact, password_hash, phone, address]
    );

    const userId = result.insertId;
    res.status(201).json({ message: 'User registered', userId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // BUG FIXED: Was 'email' (hardcoded string) instead of ? placeholder
    const [users] = await pool.query(
      `SELECT u.id, u.customer_name, u.email_contact, u.c_password, u.phone, u.address
       FROM customers u
       WHERE u.email_contact = ?`,
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    const valid = await bcrypt.compare(password, user.c_password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // BUG FIXED: Added roles to JWT payload (middleware requires req.user.roles)
    const token = jwt.sign(
      {
        id: user.id,
        name: user.customer_name,
        email: user.email_contact,
        roles: ['USER'] // default role; extend if roles table exists
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.customer_name,
        email: user.email_contact
      },
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
