const mongoose = require('mongoose');

// BUG FIXED: Was exporting as mongoose.model('transaction', Transaction) - wrong name + wrong variable
const LogSchema = new mongoose.Schema({
  transaction_id: { type: Number, required: true },
  customer_id: { type: Number, required: true },
  products: {
    id: { type: Number, required: true },
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  action: { type: String, default: 'created' }, // 'created', 'updated', 'deleted'
  changed_by: { type: Number }, // SQL user id
  date: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);
