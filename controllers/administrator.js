const Administrator = require('../models/user');
const { body } = require('express-validator');
const uploadFile = require("../helper")
const validator = [
    body('name').isString().trim().escape(),
    body('email').not().isEmpty().isEmail().trim().escape(),
    body('phone').not().isEmpty().trim().escape()
]

async function all(req, res, next) {
    let administrators = await Administrator.find({role: 'admin'});
    res.render('admin/administrators', { administrators });
}
async function clients(req, res, next) {
    let administrators = await Administrator.find({role: 'client'});
    res.render('admin/administrators', { administrators });
}
async function add(req, res) {
    let { name, email, phone, address, password, registrationDate } = req.body;    
    let administrator = new Administrator({ name, email, phone, address, password, registrationDate, role: 'admin' });  
    uploadFile(req, res, administrator, 'photo'); 
    try {
        await administrator.save()
        res.redirect('/admin/administrators');
    } catch (error) {
        res.send(error)
    }
}
async function edit(req, res) {
    let { name, email, phone, address, registrationDate } = req.body;    
    let administrator = new Administrator({ name, email, phone, address, password, registrationDate });  
    uploadFile(req, res, administrator, 'photo'); 
    try {
        await administrator.save()
        res.redirect('/admin/administrators');
    } catch (error) {
        res.send(error)
    }
}
async function remove(req, res) {
    await Administrator.deleteOne({ _id: req.params.id });
    res.redirect('/admin/administrators')
}
async function oneAPI(req, res) {
    let administrator = await Administrator.findOne({ _id: req.params.id });
    return res.json(administrator);
}
module.exports = { all, add, edit, remove, oneAPI, validator, clients}