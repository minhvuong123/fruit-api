const express = require('express');
const router = express.Router();
const categorySchema = require('../../models/category/category.model');

router.get('/', async function(req, res, next){
  try {
    const category = await categorySchema.find();
    res.json({
      category
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/', async function(req, res, next){
  try {
    const category = new categorySchema({
      category_title: req.body.category_title,
      created_at: req.body.created_at
    });
    const result = await category.save();
    res.json({
      category: result
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

module.exports = router; 