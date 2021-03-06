const express = require('express');
const app = express();
const PORT = 4000;

const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { authorization } = require('./middlewares/middlewares');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '10mb'}));
app.use((req, res, next) => authorization(req, res, next));
app.use('/static', express.static('public'));

// routes
const products = require('./routes/product/product.route');
const categories = require('./routes/category/category.route');
const users = require('./routes/user/user.route');
const orders = require('./routes/order/order.route');
const transactions = require('./routes/transaction/transaction.route');

app.use('/products', products);
app.use('/categories', categories);
app.use('/users', users);
app.use('/orders', orders);
app.use('/transaction', transactions);

mongoose.connect('mongodb://localhost/marketFruits', {useNewUrlParser: true, useUnifiedTopology: true});
const connect = mongoose.connection;
connect.on('error', function(){
  console.log('Mongodb connect to fail !');
});
connect.on('open', function(){
  console.log('Mongodb connected...');
});

app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
})