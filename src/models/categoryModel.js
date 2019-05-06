var mongoose = require('mongoose');
var constants = require('../library/utils/constants')

var bookCategory = mongoose.Schema({
    category_name: {
        type: String,
        required: true,
    },
}, 
{
    timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
    }
});

var BookCategory = module.exports= mongoose.model('categories', bookCategory)

module.exports.get = function (callback, limit) {
    BookCategory.find(callback).limit(limit);
}