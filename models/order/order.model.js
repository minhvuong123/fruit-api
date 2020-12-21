const mongoose = require('mongoose');
const productSchema = require('../product/product.model');

const orderSchema = new mongoose.Schema({
  order_user: {
    type: String
  },
  order_product: productSchema.schema,
  order_amount: {
    type: Number,
    default: 0 
  },
  order_status: {
    type: String
  },
  order_transaction: {
    type: String
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('order', orderSchema);