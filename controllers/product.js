const Product = require('../models/product');
const Category = require('../models/productCategory');
const { body } = require('express-validator');
const uploadFile = require('../helper');
const { toWords } = require('number-to-words');
const product = require('../models/product');
const pluralize = require('pluralize');
const validator = [
    body('name').isString().trim().escape(),
    body('description').isString().trim().escape()
]

async function all(req, res) {
    let products = await Product.find();
    let categories = await Category.find();
    res.render('admin/products', { products, categories });
}
async function add(req, res) {
    let { name, description, categoryId, unitPrice } = req.body;
    let product = new Product({ name, description, categoryId, unitPrice });
    uploadFile(req, res, product, 'images');
    try {
        await product.save()
        res.redirect('/admin/products');
    } catch (error) {
        res.send(error)
    }
}
async function edit(req, res) {
    let { name, description, categoryId, unitPrice, id } = req.body;
    let product = await Product.findOne({ _id: id })
    product.name = name
    product.description = description
    product.categoryId = categoryId
    product.unitPrice = unitPrice
    uploadFile(req, res, product, 'images');
    try {
        await product.save()
        res.redirect('/admin/products');
    } catch (error) {
        res.send(error)
    }
}
async function remove(req, res) {
    await Product.deleteOne({ _id: req.params.id });
    res.redirect('/admin/products')
}
async function oneAPI(req, res) {
    let product = await Product.findOne({ _id: req.params.id });
    return res.json(product);
}


/* Client side */
async function clientProducts(req, res) {
    let products = await Product.find()
    let categories = await Category.find();
    let noOfProducts = `${toWords(products.length)} ${pluralize('product', products.length)}`
    res.render('client/products', { products, categories, noOfProducts });
}
async function clientProductsByCategory(req, res) {
    let products = await Product.find({ categoryId: req.params.id })
    let categories = await Category.find();
    let noOfProducts = `${toWords(products.length)} ${pluralize('product', products.length)}`
    res.render('client/products', { products, categories, noOfProducts });
}
async function clientProductById(req, res) {
    let product = await Product.findById(req.params.id);
    product.category = await product.category()
    product.rating = await product.rating()
    // console.log(product.rating); return;
    let relatedProducts = await Product.find({ categoryId: product.categoryId }).limit(6);
    res.render('client/product-details', { product, relatedProducts });
}
async function reviewProduct(req, res) {
    if (!req.session.userId)
        return res.redirect("/login");
    let { rating, comment } = req.body
    let userId = req.session.userId;
    let productId = req.params.id;
    await Review.findOneAndUpdate({ userId }, { userId, productId, comment, rating }, { upsert: true })
    res.redirect(`/product/${productId}`)
}

module.exports = { all, add, edit, remove, oneAPI, validator, clientProducts, clientProductsByCategory, clientProductById, reviewProduct }