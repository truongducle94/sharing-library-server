Users = require('../models/userModel')
var constants = require('../library/utils/constants')

exports.validatePhone = function (req, res, next) {
    const { phone } = req.body
    Users.findOne({phone}, (err, user) => {
        req.user = user
        next()
    })
}