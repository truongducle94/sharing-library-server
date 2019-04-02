var mongoose = require('mongoose');

var allBookSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    kind: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ''
    },
    status: String,
    review: Object,
    quantity: String,
}, 
{
    timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
    }
});

var AllBooks = module.exports= mongoose.model('books', allBookSchema)

module.exports.get = function (callback, limit) {
    AllBooks.find(callback).limit(limit);
}