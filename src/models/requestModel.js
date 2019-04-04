var mongoose = require('mongoose');
var constant = require('../library/utils/constants')

var requestSchema = mongoose.Schema({
    request_type: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: constant.request_status.pending
    }
}, 
{
    timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
    }
});

var Requests = module.exports= mongoose.model('requests', requestSchema)

module.exports.get = function (callback, limit) {
    Requests.find(callback).limit(limit);
}