var mongoose = require('mongoose');

var reviewSchema = mongoose.Schema({
    book_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        default: ''
    },
    rating: {
        type: String,
        require: true
    }
}, 
{
    timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
    }
});

var Reviews = module.exports= mongoose.model('reviews', reviewSchema)

module.exports.get = function (callback, limit) {
    Reviews.find(callback).limit(limit);
}