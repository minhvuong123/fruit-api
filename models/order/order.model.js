const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_product: {
    type: String,
    required: true
  },
  order_amount: {
    type: Number,
    default: 0 
  },
  order_status: {
    type: String
  },
  order_transaction: {
    type: String,
    required: true
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('order', orderSchema);