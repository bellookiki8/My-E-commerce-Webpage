const mongoose = require('mongoose');
const Category = require('./productCategory');
const Review = require('./review');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [2, 'Name cannot be less than 2 character']
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: String,
    images: {
        type: [String],
        default: function () {
            let img = ['/nopics.jpg'];
            return img
        }
    },
    unitPrice: {
        type: Number,
    }
});

class Product {
    toString() {
        return this.name;
    }

    async category() {
        return await Category.find({ _id: this.categoryId })
    }

    get image() {
        return this.images[this.images.length - 1];
    }

    get ratingCount() {
        return parseInt(async function (id) {
            return await Review.countDocuments({ productId: id });
        }(this._id));
    }

    get reviewCount() {
        return parseInt(async function (id) {
            return await Review.countDocuments({ productId: id });
        }(this._id));
    }

    async rating() {
        return await Review.aggregate([
            { $match: { productId: this._id } },
            { $group: { _id: "$productId", average: { $avg: "$rating" } } }
         ]);
    }

}

schema.loadClass(Product);
module.exports = mongoose.model('Product', schema);