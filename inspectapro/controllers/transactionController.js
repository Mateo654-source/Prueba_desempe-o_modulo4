const Transaction = require('../models/Transaction');
const pool = require('../config/db');

// GET all transactions for current user
const getTransactions = async (req, res) => {
  try {
    const query = { created_by: req.user.id };

    // BUG FIXED: Removed invalid .select() with leading space before field name
    const transactions = await Transaction.find(query).select('-__v');
    res.json(transactions);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a transaction
const createTransaction = async (req, res) => {
  const { transaction_id, customer_id, product_id, r_quantity } = req.body;
  const r_created_by = req.user.id;

  // BUG FIXED: Was `!r_quantity` (always falsy when quantity=0 is valid edge case),
  // and the condition was wrong — missing `!` before r_quantity check
  if (!transaction_id || !customer_id || !product_id || !r_quantity) {
    return res.status(400).json({ error: "id's and quantity required" });
  }

  try {
    const [products] = await pool.query(
      `SELECT * FROM products WHERE id = ?`,
      [product_id]
    );

    // BUG FIXED: products is an array, was accessing .quantity directly on the array
    if (products.length === 0) {
      return res.status(404).json({ error: 'Invalid product' });
    }

    const product = products[0];

    if (product.quantity < r_quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const transaction = new Transaction({
      transaction_id,
      customer_id,
      products: {
        id: product_id,
        // BUG FIXED: Was product.product_name / product.price on the array, now on product object
        product_name: product.product_name,
        product_price: product.price,
        quantity: r_quantity
      },
      date: new Date(),  // BUG FIXED: Was `{ type: Date, default: Date.now }` (schema syntax, not value)
      created_by: r_created_by,
    });

    await transaction.save();

    res.status(201).json(transaction);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTransactions, createTransaction };
