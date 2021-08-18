const Category = require('../models/productCategory');
const { body } = require('express-validator');
const {uploadPath} = require("../config")
const validator = [
    body('name').isString().trim().escape(),
    body('description').isString().trim().escape()
]

async function all(req, res, next) {
    let categories = await Category.find();
    res.render('admin/categories', { categories });
}
async function add(req, res) {
    body('name').isString().trim()
  body('description').isString().trim().escape()
    let { name, description } = req.body;
    let image = req.files ? req.files.image : null;
    if (image) {
        let ext = image.name.slice(image.name.lastIndexOf('.'))
        let allowed = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg'];
        if (!allowed.includes(image.mimetype))
            return res.send('Invalid file format. Only jpg, png, gif and jpeg is allowed')
        var fileName = image ? ('/categories/' + name + '_' + Number(new Date()) + ext) : null;
    }
    let category = new Category({ name: name, description: description });
    if (fileName)
        image.mv(uploadPath + fileName, (err, success) => {
            if (err) return console.log(err)
        })
    category.image = fileName;
    try {
        await category.save()
        res.redirect('/admin/categories');
    } catch (error) {
        res.send(error)
    }
}
async function edit(req, res) {
    let { name, description, id } = req.body;
    let image = req.files ? req.files.image : null;
    if (image) {
        let ext = image.name.slice(image.name.lastIndexOf('.'))
        let allowed = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg'];
        if (!allowed.includes(image.mimetype))
            return res.send('Invalid file format. Only jpg, png, gif and jpeg is allowed')
        var fileName = image ? ('/categories/' + name + '_' + Number(new Date()) + ext) : null;
    }
    let category = await Category.findOne({ _id: id })
    // console.log(category); return
    category.name = name
    category.description = description
    if (fileName) {
        image.mv(uploadPath + fileName, (err, success) => {
            if (err) return console.log(err)
        })
        category.image = fileName;
    }
    try {
        await category.save()
        res.redirect('/admin/categories');
    } catch (error) {
        res.send(error)
    }
}
async function remove(req, res) {
    await Category.deleteOne({ _id: req.params.id });
    res.redirect('/admin/categories')
}
async function oneAPI(req, res) {
    let category = await Category.findOne({ _id: req.params.id });
    return res.json(category);
}
module.exports = { all, add, edit, remove, oneAPI, validator}