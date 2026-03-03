const pool = require('../config/db');

// GET all customers (ADMIN only)
const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, customer_name, email_contact, phone, address FROM customers'
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET current authenticated user
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, customer_name, email_contact, phone, address FROM customers WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, getMe };
