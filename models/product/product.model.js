const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_title: {
    type: String,
    required: true
  },
  product_price: {
    type: Number,
    required: true,
    default: 0
  },
  product_amount: {
    type: Number,
    required: true,
    default: 0
  },
  product_sell_amount: {
    type: Number,
    default: 0
  },
  product_des: {
    type: String
  },
  product_images_link: {
    type: Array,
    default: []
  },
  product_images_list: {
    type: Array,
    default: []
  },
  product_rate: {
    type: Array,
    default: []
  },
  product_size: {
    type: String
  },
  product_type: {
    type: String
  },
  product_origin: {
    type: String
  },
  product_ward: {
    type: String
  },
  product_supplier: {
    type: String
  },
  product_discount: {
    type: Number
  },
  created_at: {
    type: String
  }
})

module.exports = mongoose.model('product', productSchema);