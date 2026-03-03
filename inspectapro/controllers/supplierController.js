const pool = require('../config/db');
const LogSupplier = require('../models/LogSupplier');

// GET all suppliers
const getSuppliers = async (req, res) => {
  try {
    // BUG FIXED: Was querying 'suppilers' (typo)
    const [suppliers] = await pool.query(`SELECT * FROM suppliers`);
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a supplier and log the change in MongoDB
const updateSupplier = async (req, res) => {
  const { supplier_name, email_contact } = req.body;

  try {
    // BUG FIXED: Was `WHERE id = '?` (broken string), and destructuring was wrong
    const [rows] = await pool.query(
      `SELECT * FROM suppliers WHERE id = ?`,
      [req.params.id]
    );

    // BUG FIXED: Was checking `!user` but rows is an array
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const current = rows[0];

    // Build old/new snapshot for audit log
    const oldData = {
      supplier_name: current.supplier_name,
      email_contact: current.email_contact,
    };
    const newData = {
      supplier_name: supplier_name || current.supplier_name,
      email_contact: email_contact || current.email_contact,
    };

    // Update in MySQL
    await pool.query(
      `UPDATE suppliers SET supplier_name = ?, email_contact = ? WHERE id = ?`,
      [newData.supplier_name, newData.email_contact, req.params.id]
    );

    // BUG FIXED: Was `require('..config/mongo')` (missing slash), wrong usage of connection,
    // and had floating `note:` statement outside any object
    const log = new LogSupplier({
      supplier_id: current.id,
      changed_by: req.user.id,
      old_data: oldData,
      new_data: newData,
      note: `Supplier updated: ${JSON.stringify(oldData)} → ${JSON.stringify(newData)}`,
    });

    await log.save();

    res.json({ message: 'Supplier updated', supplier: newData, log });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSuppliers, updateSupplier };
