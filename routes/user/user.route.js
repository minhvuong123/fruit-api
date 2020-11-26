const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { rootPath, configToken, verifyJwtToken } = require('../../utils');
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
    const saveUrl = `${path.join(rootPath, 'public/images')}\\${imageName}.${exten}`;
    req.body.user.image_url = base64Data ? `static/images/${imageName}.${exten}` : '';

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
            image_url: req.body.user.image_url,
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
        image_url: req.body.user.image_url,
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
      const exten = req.body.typeImage;
      const imageName = uuid();
      const saveUrl = `${path.join(rootPath, 'public/images')}\\${imageName}.${exten}`;
      req.body.user.image_url = `static/images/${imageName}.${exten}`;

      delete req.body.user.user_image_base64;
      delete req.body.user.status;

      require("fs").writeFile(saveUrl, base64Data, 'base64', async function (err) {
        if (!err) {
          const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user })
          if (user.ok === 1) {
            res.status(200).json({
              status: 'ok',
              image_url: req.body.user.image_url
            });
          }
        }
      });
    } else {
      const user = await userSchema.where({ _id: req.body.user._id }).updateOne({ ...req.body.user })
      if (user.ok === 1) {
        res.status(200).json({
          status: 'ok',
          image_url: req.body.user.image_url
        });
      }
    }

  } catch (error) {
    res.status(400).json({
      status: 'error'
    });
  }
})

router.post('/register', async function (req, res, next) {
  try {
    const user_name = req.body.user.user_name;
    const user_email = req.body.user.user_email;
    const user_phone = req.body.user.user_phone;
    const user_password = bcrypt.hashSync(req.body.user.user_password, 10);
    const created_at = req.body.user.created_at;
    // const result = await userSchema.where({ _id }).findOne();
    const user = new userSchema({ user_name, user_email, user_phone, user_password, created_at });
    const result = await user.save();

    if (Object.keys(result).length > 0) {
      res.status(200).json({
        user: result
      });
    } else {
      res.status(404).json({
        message: 'Information is error'
      });
    }

  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

const refreshTokens = {};
router.post('/login', async function (req, res, next) {
  try {
    const user_name = req.body.user.user_name;
    const user_password = req.body.user.user_password;

    const user = await userSchema.where({ user_name }).findOne();
   
    if (Object.keys(user).length > 0) {
      const match = await bcrypt.compare(user_password, user.user_password);
      if (match) {
        const token = jwt.sign({...user}, configToken.secretToken, { expiresIn: configToken.tokenLife });
        const refreshToken = jwt.sign({...user}, configToken.refreshTokenSecret)

        refreshTokens[refreshToken] = user;
        
        res.status(200).json({ token, refreshToken });
        return;
      }
      res.status(404).json({
        status: 'error'
      });
      return;
    }
    res.status(404).json({
      status: 'error'
    });
    return;
  } catch (error) {
    res.status(400).json({
      message: 'server error'
    })
  }
})

router.post('/refreshToken', async function(req, res){
  const refreshTokenClient = req.body.refreshToken;
  if (refreshTokenClient && refreshTokens[refreshTokenClient]) {
      try {
          await verifyJwtToken(refreshTokenClient, configToken.refreshTokenSecret);
          const user = refreshTokens[refreshTokenClient];

          const accessToken = jwt.sign({...user}, configToken.secretToken, { expiresIn: 60 })
          res.json({
              token: accessToken
          });
      } catch (error) {
          res.status(403).json({
              message: 'Invalid refresh token',
          });
      }
  } else {
      res.status(403).send({
          message: 'No token provided.',
      });
  }
});

router.post('/delete', async function (req, res, next) {
  try {
    const id = req.body.id;
    const result = await userSchema.deleteOne({ _id: id });

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