const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
 
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('transaction', transactionSchema);