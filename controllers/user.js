const { hashPassword } = require('password-hashing-entreprenerd');
const { validatePassword } = require('password-hashing-entreprenerd');
const User = require('../models/user');
async function login(req, res) {
    let { phone, password } = req.body
    let user = await User.findOne({ phone: phone })
    if (user && validatePassword(password, user.password.salt, user.password.hash)) {
        req.session.userId = user._id
        console.log(req.session.userId)
        req.flash('success', `Welcome ${user}`)
        res.redirect('/')
    } else {
      req.flash('danger', "Username or password mismatch")
        res.redirect('/login')
    }
}
function renderLogin(req, res) {
    res.render('client/login', { title: 'High way' });
  }
async function logout(req, res) {
    req.session.destroy();
    res.redirect('/')
}
function renderSignUp(req, res) {
    res.render('client/signup', { title: 'High way' });
  }
  async function signUp(req, res) {
    let {name, email, phone, address, password} = req.body
    password = hashPassword(password);
    let user = User({name, email, phone, address, password, role: 'client'})
    await user.save();
    req.session.userId = user._id;
    res.redirect('/');
  }
module.exports = {login, logout, renderLogin, renderSignUp, signUp}