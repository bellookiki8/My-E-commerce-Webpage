var express = require('express');
var router = express.Router();
const { resolve } = require('path');
const { uploadPath } = require('../config');
const categoryController = require('../controllers/category');
const productController = require('../controllers/product');
const orderController = require('../controllers/order');
const administratorController = require('../controllers/administrator');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('admin/index');
});

/* Category routes. */
router.get('/categories', categoryController.all);
router.post('/categories', categoryController.validator, categoryController.add);
router.post('/category/edit', categoryController.validator, categoryController.edit);
router.get('/category/:id/delete', categoryController.remove);
router.get('/category/api/:id', categoryController.oneAPI)

/* Administrator routes. */
router.get('/clients', administratorController.clients);
router.get('/administrators', administratorController.all);
router.post('/administrators', administratorController.validator, administratorController.add);
router.post('/administrator/edit', administratorController.validator, administratorController.edit);
router.get('/administrator/:id/delete', administratorController.remove);
router.get('/administrator/api/:id', administratorController.oneAPI)

/* Product routes. */
router.get('/products', productController.all);
router.post('/product', productController.validator, productController.add);
router.post('/product/edit', productController.validator, productController.edit);
router.get('/product/:id/delete', productController.remove);
router.get('/product/api/:id', productController.oneAPI)

/* Order routes */
router.get('/orders', orderController.validator, orderController.all);
router.get('/order/refund/:id', orderController.cancel);
router.get('/order/ship/:id', orderController.ship);


router.get('/administrators', function (req, res, next) {
  res.render('admin/administrators');
});



module.exports = router;
