const { resolve } = require('path');
const fs = require('fs');
const uploadPath = resolve('./uploads')

function uploadFile(req, res, obj, name) {
    if (req.files && req.files[name]) {
        obj[name] = (Array.isArray(obj[name]) && obj[name].length == 1 && obj[name].includes('/nopics.jpg')) ? [] : obj[name];
        if (Array.isArray(req.files[name])) {
            for (const image of req.files[name]) {
                obj[name].push(doUpload(image, obj, name, res));
            }
        } else {
            let image = req.files[name]
            obj[name] = doUpload(image, obj, name, res);
        }
    }
}

function doUpload(image, obj, name, res) {
    let folder = obj.collection.CollectionName;
    if (!fs.existsSync(`./uploads/${folder}`)) {
        fs.mkdirSync(`./uploads/${folder}`)
    }
    let ext = image.name.slice(image.name.lastIndexOf('.'))
    let allowed = ['image/jpg', 'image/png', 'image/gif', 'image/jpeg'];
    if (!allowed.includes(image.mimetype))
        return res.send('Invalid file format. Only jpg, png, gif and jpeg is allowed')
    var fileName = image ? (`/${folder}/` + obj + '_' + process.hrtime.bigint() + ext) : null;
    image.mv(uploadPath + fileName, (err, success) => {
        if (err) return console.log(err)
    })
    return fileName;
}

module.exports = uploadFile;