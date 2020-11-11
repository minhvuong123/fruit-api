const express = require('express');
const { result } = require('lodash');
const router = express.Router();
const _ = require('lodash');
const productSchema = require('../../models/product/product.model');

router.get('/', async function (req, res, next) {
  try {
    const products = await productSchema.find();
    res.json({
      products
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
    const products = await productSchema.find().skip(page * limit).limit(limit);
    const count = await productSchema.count();
    res.json({
      products,
      count
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.get('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const product = await productSchema.where({ _id: id }).findOne();
    res.json({
      product
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/category', async function (req, res, next) {
  try {
    const id = req.body.id;
    const page = +req.body.page - 1 || 0;
    const limit = +req.body.limit || 10;
    let products = [];
    let count = 0;
    if (id === 'all') {
      products = await productSchema.find().skip(page * limit).limit(limit);
      count = await productSchema.count();
    } else {
      products = await productSchema.where({ product_type: id }).find().skip(page * limit).limit(limit);
      count = await productSchema.where({ product_type: id }).count();
    }

    res.status(200).json({
      products,
      count
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

const mergeArrayOfObjects = (original, newdata, selector = 'key') => {
  newdata.forEach(dat => {
    const foundIndex = original.findIndex(ori => JSON.stringify(ori[selector]) === JSON.stringify(dat[selector]));
    if (foundIndex >= 0) original.splice(foundIndex, 1, dat);
    else original.push(dat);
  });

  return original;
};

router.post('/filter', async function (req, res, next) {
  // console.log(req.body.product_ward, req.body.product_category)
  try {
    let results = [];
    const product_category = req.body.product_category;
    const product_wards = req.body.product_ward;

    if (product_category === 'all') {
      if (product_wards.length > 0) {
        for (const ward of product_wards) {
          const productWard = await productSchema.where({ product_ward: ward });
          results.push(...productWard);
          console.log(productWard)
        }
      } else {
        results = await productSchema.find();
      }
    } else {
      if (product_wards.length > 0) {
        for (const ward of product_wards) {
          const productWard = await productSchema.where({ product_type: product_category, product_ward: ward });
          results.push(...productWard);
          console.log(productWard)
        }
      } else {
        results = await productSchema.where({ product_type: product_category });
      }
    }

    // results = mergeArrayOfObjects(productToCategory, productToWard, "_id");
    res.status(200).json({
      products: results
    });

  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/', async function (req, res, next) {
  try {
    const product = new productSchema({
      product_title: req.body.product_title,
      product_price: req.body.product_price,
      product_amount: req.body.product_amount,
      product_des: req.body.product_des,
      product_images_link: req.body.product_images_link,
      product_images_list: req.body.product_images_list,
      product_rate: req.body.product_rate,
      product_size: req.body.product_size,
      product_type: req.body.product_type,
      product_origin: req.body.product_origin,
      product_ward: req.body.product_ward,
      product_supplier: req.body.product_supplier,
      product_category: req.body.product_category,
      product_discount: req.body.product_discount,
      created_at: req.body.created_at
    });
    const result = await product.save();
    res.json({
      product: result
    });
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.patch('/', async function (req, res, next) {
  try {
    const product = await productSchema.where({ _id: req.body.product._id }).updateOne({ ...req.body.product })
    if (product.ok === 1) {
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


router.put('/file', async function (req, res, next) {
  try {
    console.log(req.body)
  } catch (error) {

  }
})

module.exports = router;  