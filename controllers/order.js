const Product = require('../models/product');
const Client = require('../models/user');
const Order = require('../models/order');
const { body } = require('express-validator');
const uploadFile = require('../helper');
const validator = body('quantity').isNumeric()

async function all(req, res) {
    let orders = await Order.find();
    for (let i = 0; i < orders.length; i++) {
        orders[i].client = await orders[i].user()
        orders[i].product = await orders[i].product()
    }
    res.render('admin/orders', { orders });
}
async function cancel(req, res) {
    await Order.findByIdAndUpdate(req.params.id, {status: 'Cancel'});
    res.redirect('/admin/orders')
}
async function ship(req, res) {
    await Order.findByIdAndUpdate(req.params.id, {status: 'Shipping'});
    res.redirect('/admin/orders')
}
async function placeOrder(req, res) {
    if(!req.session.userId)
      return res.redirect("/login");
    let userId = req.session.userId;
    let productId = req.params.id;
    let product = await Product.findById(productId);
    let quantity = req.body.quantity;
    let totalPrice = quantity * product.unitPrice;
    await Order.create({productId, userId, quantity, totalPrice, unitPrice: product.unitPrice, status: "Pending"  })
    req.flash('success', "Order received. Look forward for the delivery")
    res.redirect(`/`)
  }
module.exports = { all, cancel, ship, validator, placeOrder }