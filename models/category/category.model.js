const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_title: {
    type: String,
    required: true
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('catagory', categorySchema);