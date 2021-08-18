const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [2, 'Name cannot be less than 2 character']
    },    
    description: String,    
    image: {
        type: String,
        default: '/nopics.jpg'
    },    
    
});

class ProductCategory {
    toString(){
        return this.name;
    }
}

schema.loadClass(ProductCategory);
module.exports = mongoose.model('ProductCategory', schema);