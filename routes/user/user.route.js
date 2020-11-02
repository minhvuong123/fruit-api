const express = require('express');
const router = express.Router();
const userSchema = require('../../models/user/user.model');

router.get('/', async function(req, res, next){
  try {
    const users = await userSchema.find();
    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.get('/:page/:limit', async function(req, res, next){
  try {
    const page = +req.params.page - 1 || 0;
    const limit = +req.params.limit || 10;
    const users = await userSchema.find().skip(page*limit).limit(limit);
    res.status(200).json({
      users
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/', async function(req, res, next){
  try {
    const user = new userSchema({
      user_name: req.body.user_name,
      user_email: req.body.user_email,
      user_phone: req.body.user_phone,
      user_address: req.body.user_address,
      user_password: req.body.user_password,
      user_image: req.body.user_image,
      user_role: req.body.user_role,
      created_at: req.body.created_at
    });
    const result = await user.save();
    res.status(200).json({
      users: result
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.patch('/', async function(req, res, next){
  try {
    const user = await userSchema.where({_id: req.body.user._id}).updateOne({...req.body.user})
    if (user.ok === 1) {
      res.status(200).json({
        status: 'ok'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error'
    });
  }
})

module.exports = router; 