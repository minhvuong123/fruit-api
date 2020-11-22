const express = require('express');
const router = express.Router();
const categorySchema = require('../../models/category/category.model');

router.get('/', async function(req, res, next){
  try {
    const categories = await categorySchema.find();
    res.json({
      categories
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.get('/:page/:limit', async function (req, res, next) {
  try {
    const page = +req.params.page - 1 || 0;
    const limit = +req.params.limit || 10;
    const categories = await categorySchema.find().skip(page * limit).limit(limit);
    const count = await categorySchema.countDocuments();
    res.status(200).json({
      categories,
      count
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.get('/:id', async function(req, res, next){
  try {
    const id = req.params.id;
    const category = await categorySchema.where({_id: id}).findOne();
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
      category_title: req.body.category.category_title,
      created_at: req.body.category.created_at
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

router.patch('/', async function(req, res, next){
  try {
    const category = await categorySchema.where({ _id: req.body.category._id }).updateOne({ ...req.body.category })
    if (category.ok === 1) {
      res.status(200).json({
        status: 'ok'
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/delete', async function(req, res, next){
  try {
    const id = req.body.id;
    const result = await categorySchema.deleteOne({ _id: id });

    if (result.ok === 1) {
      res.status(200).json({
        status: 'ok'
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

module.exports = router; 