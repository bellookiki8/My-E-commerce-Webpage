const mongoose = require('mongoose');
const Category = require('./productCategory');
const schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    review:String,
    rating: {
        type: Number,
        required: true
    },
});

class Review {
    toString() {
        return this.name;
    }

    get category() {
        return async function () {
            return await Category.find({ _id: this.categoryId })
        }()
    }

    get image() {
        return this.images[this.images.length - 1];
    }

    get ratingCount() {
        return async function () {
            return await Category.find({ _id: this.categoryId })
        }()
    }
}

schema.loadClass(Review);
module.exports = mongoose.model('Review', schema);