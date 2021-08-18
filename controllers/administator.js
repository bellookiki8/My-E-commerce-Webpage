const Administrator = require ('../models/productAdministrators');
const {body} = require ('express-validator');
const {uploadPath} = require ('../config');
const validator = [
  body ('name').isString ().trim (),
  body ('description').isString ().trim ().escape (),
];

async function all (req, res, next) {
  let categories = await Administrator.find ();
  res.render ('admin/categories', {categories});
}
async function add (req, res) {
  let {name, description} = req.body;
  let image = req.files ? req.files.image : null;
  if (image) {
    let ext = image.name.slice (image.name.lastIndexOf ('.'));
    let allowed = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg'];
    if (!allowed.includes (image.mimetype))
      return res.send (
        'Invalid file format. Only jpg, png, gif and jpeg is allowed'
      );
    var fileName = image
      ? '/categories/' + name + '_' + Number (new Date ()) + ext
      : null;
  }
  let administrator = new Administrator ({name: name, description: description});
  if (fileName)
    image.mv (uploadPath + fileName, (err, success) => {
      if (err) return console.log (err);
    });
  administrator.image = fileName;
  try {
    await administrator.save ();
    res.redirect ('/admin/categories');
  } catch (error) {
    res.send (error);
  }
}

async function edit (req, res) {
  let {name, description, id} = req.body;
  let image = req.files ? req.files.image : null;
  if (image) {
    let ext = image.name.slice (image.name.lastIndexOf ('.'));
    let allowed = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg'];
    if (!allowed.includes (image.mimetype))
      return res.send (
        'Invalid file format. Only jpg, png, gif and jpeg is allowed'
      );
    var fileName = image
      ? '/categories/' + name + '_' + Number (new Date ()) + ext
      : null;
  }
  let administrator = await Administrator.findOne ({_id: id});
  // console.log(administrator); return
  administrator.name = name;
  administrator.description = description;
  if (fileName) {
    image.mv (uploadPath + fileName, (err, success) => {
      if (err) return console.log (err);
    });
    administrator.image = fileName;
  }
  try {
    await administrator.save ();
    res.redirect ('/admin/categories');
  } catch (error) {
    res.send (error);
  }
}

async function remove (req, res) {
  await Administrator.deleteOne ({_id: req.params.id});
  res.redirect ('/admin/categories');
}

async function oneAPI (req, res) {
  let administrator = await Administrator.findOne ({_id: req.params.id});
  return res.json (administrator);
}

module.exports = {add, all, remove, edit, oneAPI, validator};
