const mongoose = require('mongoose');
const User = require("./user")
const Product = require("./product")
const schema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    comment: {
        type: String,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        max: [5, "Rating cannot be more than 5"],
        min: [1, "Rating cannot be less than 1"],
    }
});

class ProductReview {
    toString(){
        return this.review
    }

    async user(){
        return await User.findById(this.userId)
    }

    async product(){
        return await Product.findById(this.productId)
    }

}

schema.loadClass(ProductReview);
module.exports = mongoose.model('ProductReview', schema);