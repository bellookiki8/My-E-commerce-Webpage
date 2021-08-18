const mongoose = require('mongoose');
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
    unitPrice: {
        type: Number,
    }
});

class Supply {
    toString(){
        return `${this.quantity} ${this.product} supplied`;
    }

    async get product(){
        return await Product.findById(this.productId)
    }
}

schema.loadClass(Supply);
module.exports = mongoose.model('Supply', schema);