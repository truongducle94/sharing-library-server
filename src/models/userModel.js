var mongoose = require('mongoose');
const constants = require('../library/utils/constants')

var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
    },
    hash_password: {
        type: String,
        required: true,
    },
    avatar: String,
    gender: {
        type: Number,
        default: constants.gender.no_data,
    },
    rank: {
        type: Number,
        default: constants.userRanking.bronze
    },
    point: {
        type: Number,
        default: 0
    },
    contributed_books: Object,
    borrowing_books: Object,
    history: Object,
    admin: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Number,
    },
    updated_at: {
        type: Number,
    }
});

userSchema.methods.toJSON = function () {
    var user = this.toObject();
    user.hash_password = undefined
    return user;
}

var Users = module.exports = mongoose.model('users', userSchema)

module.exports.get = function (callback, limit) {
    Users.find(callback).limit(limit);
}