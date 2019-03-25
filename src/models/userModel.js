var mongoose = require('mongoose');
const projectConst = require('../library/utils/constants')

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    hash_password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        default: projectConst.userRanking.bronze
    },
    point: {
        type: String,
        default: '0'
    },
    contributed_books: Object,
    admin: Boolean
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