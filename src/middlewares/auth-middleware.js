Users = require('../models/userModel')
const jwtConfig = require('../config/jwtConfig')
var projectConst = require('../library/utils/constants')
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

exports.verifyJwt = function (req, res, next) {
    if (req.headers.authorization) {
        let jwtToken = req.headers.authorization;
        jwt.verify(jwtToken, jwtConfig.jwtSecret, function (err, payload) {
            if (err) {
                res.status(401).json({
                    ok: projectConst.requestResult.failure,
                    message: 'Unauthorized user!'
                });
            } else {
                // find
                req.decode = payload;
                next();
            }
        });
    } else {
        res.status(401).json({
            ok: projectConst.requestResult.failure,
            message: 'Unauthorized user!'
        });
    }
};