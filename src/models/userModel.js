var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    gender: String,
    rank: String,
    point: String,
    contributed_books: Object,
    token: {
        type: String,
        required: true,
        default: ''
    },
}, {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    });

var Users = module.exports = mongoose.model('users', userSchema)

module.exports.get = function (callback, limit) {
    Users.find(callback).limit(limit);
}