const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: [2, 'Name cannot be less than 2 character']
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: String,
    registrationDate: {
        type: Date,
        required: true,
        default: function (){
            return new Date();
        }
    },
    photo: {
        type: String,
        default: '/nopics.jpg'
    },
    role: {
        type: String,
        enum: ["admin", "client"]
    },
    password: {
        type: {
            hash: String,
            salt: String
        },
        required: true
    }
});

class User {
    toString(){
        return this.name;
    }
}

schema.loadClass(User);
module.exports = mongoose.model('User', schema);