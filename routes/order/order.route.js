const express = require('express');
const router = express.Router();
const orderSchema = require('../../models/order/order.model');

router.get('/', async function (req, res, next) {
  try {
    const orders = await orderSchema.find();
    res.json({
      orders
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/', async function (req, res, next) {
  try {
    let order;
    const orderExist = await orderSchema.where({ order_product: req.body.order.order_product }).findOne();
    const orderChange = req.body.orderChange;
    if (orderExist) {
      order = await orderSchema.where({ order_product: req.body.order.order_product })
        .updateOne({
          order_amount: orderChange ? +req.body.order.order_amount  : +req.body.order.order_amount + orderExist.order_amount
        });
      if (order.ok === 1) {
        res.status(200).json({
          status: 'ok'
        });
      }
    } else {
      const order = new orderSchema({
        order_product: req.body.order.order_product,
        order_amount: req.body.order.order_amount,
        order_status: req.body.order.order_status,
        order_transaction: req.body.order.order_transaction,
        created_at: req.body.order.created_at
      });

      const result = await order.save();
      res.json({
        order: result,
        status: 'ok'
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error
    })
  }
})

module.exports = router; 