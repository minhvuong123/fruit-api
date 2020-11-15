const express = require('express');
const router = express.Router();
const path = require('path');
const { rootPath } = require('../../utils');
const { v1: uuid } = require('uuid');
const userSchema = require('../../models/user/user.model');

router.get('/', async function (req, res, next) {
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

router.get('/:page/:limit', async function (req, res, next) {
  try {
    const page = +req.params.page - 1 || 0;
    const limit = +req.params.limit || 10;
    const users = await userSchema.find().skip(page * limit).limit(limit);
    const count = await userSchema.count();
    res.status(200).json({
      users,
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
    const base64Data = req.body.user.user_image_base64.split(";base64,")[1];
    const exten = req.body.typeImage;
    const imageName = uuid();
    const saveUrl = `${path.join(rootPath, 'public/users')}\\${imageName}.${exten}`;
    req.body.user.user_image = base64Data ? `static/users/${imageName}.${exten}` : '';

    if (base64Data) {
      delete req.body.user.user_image_base64;

      require("fs").writeFile(saveUrl, base64Data, 'base64', async function (err) {
        if (!err) {
          const user = new userSchema({
            user_name: req.body.user.user_name,
            user_email: req.body.user.user_email,
            user_phone: req.body.user.user_phone,
            user_address: req.body.user.user_address,
            user_password: req.body.user.user_password,
            user_image: req.body.user.user_image,
            user_role: req.body.user.user_role,
            created_at: req.body.user.created_at
          });
          const result = await user.save();
          res.status(200).json({
            user: result
          });
        }
      });
    } else {
      const user = new userSchema({
        user_name: req.body.user.user_name,
        user_email: req.body.user.user_email,
        user_phone: req.body.user.user_phone,
        user_address: req.body.user.user_address,
        user_password: req.body.user.user_password,
        user_image: req.body.user.user_image,
        user_role: req.body.user.user_role,
        created_at: req.body.user.created_at
      });
      const result = await user.save();
      res.status(200).json({
        user: result
      });
    }

  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})


router.patch('/', async function (req, res, next) {
  try {
    if (req.body.user.user_image_base64) {
      const base64Data = req.body.user.user_image_base64.split(";base64,")[1];
      const length = req.body.user.user_image.split('.').length;
      const exten = req.body.user.user_image.split('.')[length - 1];
      const imageName = uuid();
      const saveUrl = `${path.join(rootPath, 'public/users')}\\${imageName}.${exten}`;
      req.body.user.user_image = `static/users/${imageName}.${exten}`;

      delete req.body.user.user_image_base64;
      delete req.body.user.status;
      console.log(req.body.user);
      require("fs").writeFile(saveUrl, base64Data, 'base64', async function (err) {
        if (!err) {
          const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user })
          if (user.ok === 1) {
            res.status(200).json({
              status: 'ok'
            });
          }
        }
      });
    } else {
      const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user })
      if (user.ok === 1) {
        res.status(200).json({
          status: 'ok'
        });
      }
    }

  } catch (error) {
    res.status(400).json({
      status: 'error'
    });
  }
})

module.exports = router; 