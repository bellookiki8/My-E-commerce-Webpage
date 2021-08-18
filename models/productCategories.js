const mongoose = require ('mongoose');
const schema = new mongoose.Schema ({
  name: {
    type: String,
    required: true,
    min: [2, 'name too short'],
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    default: function () {
      let img = ['/nopics.jpg'];
      return img;
    },
  },
});

class ProductCategory {
  toString () {
    return this.name;
  }
}

schema.loadClass (ProductCategory);
module.exports = mongoose.model ('ProductCategory', schema);
