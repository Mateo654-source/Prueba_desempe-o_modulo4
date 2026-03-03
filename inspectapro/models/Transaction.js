const mongoose = require('mongoose');

const Transaction = new mongoose.Schema({
  transaction_id: { type: Number, required: true },
  customer_id: { type: Number, required: true },
  products: {
    id : { type: Number, required: true },
    product_name : { type: String, required: true },
    product_price : { type: Number, required: true },
    quantity : { type: Number, required: true }
  },
  date: { type: Date, default: Date.now },
  created_by: { type: Number, required: true }, // SQL user id
  updated_at: { type: Date, default: Date.now },
});



module.exports = mongoose.model('transaction', Transaction);