const express = require('express');
const router = express.Router();
const transactionSchema = require('../../models/transaction/transaction.model');
const orderSchema = require('../../models/order/order.model');

router.get('/', async function (req, res, next) {
  try {
    const transctions = await transactionSchema.find();
    const count = await transactionSchema.count();
    res.json({
      transctions,
      count
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/', async function (req, res, next) {
  try {
      const transction = new transactionSchema({
        transaction_user: req.body.transaction.transaction_user,
        transaction_fullname: req.body.transaction.transaction_fullname,
        transaction_phone: req.body.transaction.transaction_phone,
        transaction_state: req.body.transaction.transaction_state,
        transaction_district: req.body.transaction.transaction_district,
        transaction_ward: req.body.transaction.transaction_ward,
        transaction_street: req.body.transaction.transaction_street,
        transaction_orders: req.body.transaction.transaction_orders,
        created_at: req.body.transaction.order_status
      });

      const result = await transction.save();
      if (result) {
        for (const order of req.body.transaction.transaction_orders) {
          await orderSchema.where({ _id: order._id }).updateOne({ order_status: 'approved' }); 
        }
      }
      res.status(200).json({
        transaction: result,
        status: 'ok'
      });
  } catch (error) {
    res.status(400).json({
      message: error
    })
  }
});

router.post('/delete', async function (req, res, next){
  try {
    const result = await transactionSchema.deleteOne({_id: req.body.id});
    if (result.ok === 1) {
      res.status(200);
      res.json({
        status: 'ok'
      });
      return;
    }
    res.status(401);
    res.json({
      status: 'fail'
    });
  } catch (error) {
    res.status(400).json({
      message: error
    })
  }
})

module.exports = router; 