var mongoose = require('mongoose');
var constants = require('../library/utils/constants')

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
    status: {
        type: String,
        default: constants.book_status.pending
    },
    review_id: Array,
    contributor_id: String,
    borrow_at: Date,
    deadline_at: Date,
    times_borrow: Number,
    average_point: String,
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