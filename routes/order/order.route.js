const express = require('express');
const router = express.Router();
const orderSchema = require('../../models/order/order.model');

router.get('/', async function(req, res, next){
  try {
    const order = await orderSchema.find();
    res.json({
      order
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/', async function(req, res, next){
  try {
    const order = new orderSchema({
      order_product: req.body.order_product,
      order_amount: req.body.order_amount,
      order_status: req.body.order_status,
      order_transaction: req.body.order_transaction,
      created_at: req.body.created_at
    });
    console.log(order)
    const result = await order.save();
    res.json({
      order: result
    });
  } catch (error) {
    res.status(400).json({
      message: error
    })
  }
})

module.exports = router; 