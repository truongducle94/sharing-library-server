Users = require('../models/userModel')
const bcrypt = require('bcrypt-nodejs')
var projectConst = require('../library/utils/constants')
var authMiddleware = require('../middlewares/auth-middleware')
var jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig')


async function onCheckingEmail(email) {
    let check
    await Users.findOne({ email: email }, function (err, user) {
        if (err) {
            console.log('SERVER ERROR')
        }
        if (Boolean(user)) {
            check = false
        } else {
            check = true
        }
    })
    return check
}

//Lấy thông tin tất cả người dùng
exports.getAll = (req, res) => {
    if (req.decode.admin) {
        Users.get((err, users) => {
            if (err) {
                res.json({
                    ok: projectConst.requestResult.failure,
                    message: err,
                });
            }
            res.json({
                ok: projectConst.requestResult.success,
                message: "User retrieved successfully",
                data: users,
            });
        })
    } else {
        res.status(401).json({
            ok: projectConst.requestResult.failure,
            message: 'UNAUTHORIZED',
        })
    }

}

//Đăng ký
exports.create = async (req, res) => {
    let name = req.body.name ? req.body.name : user.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let gender = req.body.gender
    const checkEmail = await onCheckingEmail(email)
    if (checkEmail) {
        bcrypt.hash(password, null, null, (err, hash_password) => {
            if (err) console.log(err, 'Lỗi')
            else {
                let user = new Users({
                    name: name,
                    email: email,
                    hash_password: hash_password,
                    phone: phone,
                    gender: gender,
                })
                user.save((err) => {
                    if (err) res.json({
                        ok: projectConst.requestResult.failure,
                        message: err
                    })
                    res.json({
                        ok: projectConst.requestResult.success,
                        message: 'New user created!',
                        data: user
                    });
                })
            }
        })
    } else res.json({
        ok: projectConst.requestResult.failure,
        message: 'Email này đã được sử dụng'
    })
}

//lấy thông tin cá nhân
exports.getProfile = (req, res) => {
    let email = req.decode.email
    Users.findOne({ email: email }, (err, user) => {
        if (err) {
            res.json({
                ok: projectConst.requestResult.failure,
                message: 'Internal Server'
            })
            return
        }
        if (Boolean(user)) {
            res.status(200).json({
                ok: projectConst.requestResult.success,
                message: 'Lấy thông tin thành công',
                data: user
            })
        } else {
            res.status(401).json({
                ok: projectConst.requestResult.failure,
                message: 'Unauthorized user!'
            })
        }
    })
}

//đăng nhập
exports.login = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    Users.findOne({ email: email }, (err, user) => {
        if (err) {
            res.json({
                ok: projectConst.requestResult.failure,
                message: 'Internal Server'
            })
            return
        }
        if (Boolean(user)) {
            bcrypt.compare(password, user.hash_password, (err, checkPass) => {
                if (err) {
                    res.json({
                        ok: projectConst.requestResult.failure,
                        message: 'Internal Server'
                    })
                    return
                }
                if (checkPass) {
                    let payload = {
                        email: user.email,
                        admin: user.admin,
                    }
                    jwt.sign(payload, jwtConfig.jwtSecret, { expiresIn: jwtConfig.expiresIn }, (err, token) => {
                        if (err) console.log(err)
                        res.json({
                            ok: projectConst.requestResult.success,
                            message: 'Đăng nhập thành công',
                            data: {
                                token: token,
                                info: user
                            }
                        })
                    })
                } else {
                    res.json({
                        ok: projectConst.requestResult.failure,
                        message: 'Sai mật khẩu'
                    })
                }
            })
        } else res.json({
            ok: projectConst.requestResult.failure,
            message: 'Email đăng nhập không tồn tại'
        })
    })
}