const mongoose = require('mongoose');
const orderSchema = require('../order/order.model');

const transactionSchema = new mongoose.Schema({
  transaction_user: {
    type: String
  },
  transaction_fullname: {
    type: String
  },
  transaction_phone: {
    type: String
  },
  transaction_state: {
    type: String
  },
  transaction_district: {
    type: String
  },
  transaction_ward: {
    type: String
  },
  transaction_street: {
    type: String
  },
  transaction_orders: [orderSchema.schema],
  transaction_status: {
    type: String,
    default: 'pending'
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('transaction', transactionSchema);