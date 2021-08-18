const mongoose = require('mongoose');
const User = require("./user")
const Product = require("./product")
const schema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: [ 'Pending', 'Shipping', 'Completed','Cancel',]
    }
});

class Order {
    async user() {
        return await User.findById(this.userId)
    }

    async product() {
        return await Product.findById(this.productId)
    }
    toString() {
        return `${this.user} orders ${this.quantity} of ${this.product}`
    }
}

schema.loadClass(Order);
module.exports = mongoose.model('Order', schema);