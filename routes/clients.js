var express = require ('express');
var router = express.Router ();
const Category = require ('../models/productCategory');
const Product = require ('../models/product');
const Review = require ('../models/productReview');
const User = require ('../models/user');
const Order = require ('../models/order');
const productController = require ('../controllers/product');
const userController = require ('../controllers/user');
const orderController = require ('../controllers/order');
let {
  validatePassword,
  hashPassword,
} = require ('password-hashing-entreprenerd');
/* GET home page. */
router.get ('/', async function (req, res) {
  let categories = await Category.find ();
  let latestProducts = await Product.find ().sort ({_id: -1}).limit (6);
  res.render ('client/index', {categories, latestProducts});
});
router.get ('/products', productController.clientProducts);
router.get (
  '/products/category/:id',
  productController.clientProductsByCategory
);
router.get ('/product/:id', productController.clientProductById);
router.post ('/product/review/:id', productController.reviewProduct);
router.post ('/product/order/:id', orderController.placeOrder);

router.get ('/my-orders', async (req, res) => {
  let orders = await Order.find ({userId: req.session.userId});
  for (let i = 0; i < orders.length; i++) {
    orders[i].client = await orders[i].user ();
    orders[i].product = await orders[i].product ();
  }
  res.render ('client/orders', {orders});
});
router.get ('/order/cancel', async (req, res) => {
  let orders = await Order.find ({userId: req.session.userId});
  res.render ('client/orders');
});
router.get ('/order/received', async (req, res) => {
  let orders = await Order.find ({userId: req.session.userId});
  res.render ('client/orders');
});

router.get ('/contact', function (req, res) {
  res.render ('client/contact', {title: 'High way'});
});
router.get ('/about', function (req, res) {
  res.render ('client/about', {title: 'High way'});
});
router.get ('/login', userController.renderLogin);
router.post ('/login', userController.login);
router.get ('/logout', userController.logout);
router.get ('/signup', userController.renderSignUp);
router.post ('/signup', userController.signUp);
router.get ('/setup', async (req, res) => {
  let admins = await User.find ({role: 'admin'});
  if (admins.length != 0) {
    req.flash ('info', 'Admin user already exists');
    return res.redirect ('/');
  }
  let users = await User.create ({
    role: 'admin',
    name: 'Admin',
    phone: '00000000000',
    email: 'admin@gmail.com',
    password: hashPassword ('1234567890'),
  });
  req.flash (
    'success',
    'Setup completed. admin created with phone: 00000000000 and password: 1234567890'
  );
  res.redirect ('/admin');
});
module.exports = router;
