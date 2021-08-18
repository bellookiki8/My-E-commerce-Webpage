const mongoose = require('mongoose');
const User = require("./user")
const Product = require("./product")
const schema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    complaint: {
        type: String,
        required: true
    }
});

class Complaint {
    toString() {
        return this.complaint
    }

    async get user(){
        return await User.findById(this.userId)
    }

    async get product(){
        return await Product.findById(this.productId)
    }
}

schema.loadClass(Complaint);
module.exports = mongoose.model('Complaint', schema);