var mongoose = require('mongoose');
var constant = require('../library/utils/constants')

var requestSchema = mongoose.Schema({
    request_type: {
        type: Number,
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
    user_rank: {
        type: Number,
        require: true,
    },
    status: {
        type: Number,
        default: constant.request_status.pending
    },
    created_at: {
        type: Number,
    },
    updated_at: {
        type: Number,
    }
});

requestSchema.methods.toJSON = function () {
    let request = this.toObject();
    request.user_id = undefined
    return request;
}

var Requests = module.exports= mongoose.model('requests', requestSchema)

module.exports.get = function (callback, limit) {
    Requests.find(callback).limit(limit);
}