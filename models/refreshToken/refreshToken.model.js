const mongoose = require('mongoose');

const refreshToken = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('refreshToken', refreshToken);