const mongoose = require('mongoose');

const LogSupplierSchema = new mongoose.Schema({
  supplier_id: { type: Number, required: true },
  changed_by: { type: Number, required: true }, // SQL user id
  old_data: {
    supplier_name: { type: String },
    email_contact: { type: String },
  },
  new_data: {
    supplier_name: { type: String },
    email_contact: { type: String },
  },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LogSupplier', LogSupplierSchema);
