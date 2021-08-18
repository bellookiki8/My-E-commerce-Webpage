const User = require('../models/user');
async function authenticateAdmin(req, res, next) {
    if (!req.session.userId) {
        req.flash('danger', 'You need to login first.')
        return res.redirect('/login');
    }
    let user = await User.findById(req.session.userId)
    if(user.role == 'admin')next();
    else {
        req.flash('danger', 'You do not have permission to visit this page.')
        return res.redirect('/');
    }
}
module.exports = authenticateAdmin;