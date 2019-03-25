var jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig')

exports.createJwt = async ({payload}) => {
    var token = await jwt.sign(payload, jwtConfig.jwtSecret, {expiresIn: jwtConfig.expiresIn})
    console.log(token, 'AAAAAAAAAAAA')
    return token
}