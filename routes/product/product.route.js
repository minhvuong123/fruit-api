const express = require('express');	
const router = express.Router();	
const productSchema = require('../../models/product/product.model');	

router.get('/', async function(req, res, next){	
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

router.get('/:page/:limit', async function(req, res, next){	
  try {	
    const page = +req.params.page - 1 || 0;	
    const limit = +req.params.limit || 10;	
    const products = await productSchema.find().skip(page*limit).limit(limit);	
    res.json({	
      products	
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
    const product = await productSchema.where({_id: id}).findOne();
    console.log(id, product)
    res.json({	
      product	
    });	
  } catch (error) {	
    res.status(400).json({	
      message: 'server error'	
    })	
  }	
})

router.post('/category', async function(req, res, next){	
  try {	
    const id = req.body.id;
    let products = [];
    if (id === 'all') {
      products = await productSchema.find();
    } else {
      products = await productSchema.where({product_type: id}).find();
    }
    
    res.json({	
      products
    });	
  } catch (error) {	
    res.status(400).json({	
      message: 'server error'	
    })	
  }	
})

router.post('/', async function(req, res, next){	
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

router.patch('/', async function(req, res, next){	
  try {	
    const product = await productSchema.where({_id: req.body.product._id}).updateOne({...req.body.product})	
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


router.put('/file', async function(req, res, next) {	
  try {	
    console.log(req.body)	
  } catch (error) {	

  }	
})	

module.exports = router;  