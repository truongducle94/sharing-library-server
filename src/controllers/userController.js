Users = require('../models/userModel')
const bcrypt = require('bcrypt-nodejs')
var multer = require('multer')
var constants = require('../library/utils/constants')
var jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig')

//upload formdata config
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/users')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})
var upload = multer({ storage: storage }).single('avatar')

//update profile
exports.updateProfile = (req, res) => {
    const user = req.decode.user
    if (!user) {
        res.status(401).json({
            ok: constants.requestResult.failure,
            message: 'Người dùng không hợp lệ',
        })
        return
    }

    upload(req, res, function (error) {
        if (error) {
            res.status(400).json({
                ok: 0,
                message: 'BAD REQUEST'
            })
            return
        }

        Users.findOne({ phone: req.body.phone }, (err, checkUser) => {
            if (!!checkUser && (req.body.phone !== user.phone)) {
                res.json({
                    ok: constants.requestResult.failure,
                    message: 'Số điện thoại đã được đăng ký',
                })
                return
            }

            let validateCount = 0
            Object.keys(req.body).map(value => {
                if (value !== 'admin' && !!req.body[value] && req.body[value] !== user[value]) {
                    user[value] = req.body[value]
                    validateCount++
                }
            })
            if (!!req.file && req.file.filename != user.avatar) {
                user.avatar = req.file.filename
                validateCount++
            }

            if (validateCount == 0) {
                res.status(400).json({
                    ok: constants.requestResult.failure,
                    message: 'Không có thông tin nào cần thay đổi'
                })
                return
            }

            user.updated_at = new Date().getTime()

            user.save(function (err) {
                if (err) {
                    res.status(500).json({
                        ok: constants.requestResult.failure,
                        message: err,
                    });
                    return
                }
                res.status(200).json({
                    ok: constants.requestResult.success,
                    message: 'Update thông tin thành công',
                    data: user
                });
            });
        })
    })
}

//Lấy thông tin tất cả người dùng
exports.getAll = (req, res) => {
    if (req.decode.user.admin) {
        Users.get((err, users) => {
            if (err) {
                res.status(500).json({
                    ok: constants.requestResult.failure,
                    message: err,
                });
                return
            }
            res.status(200).json({
                ok: constants.requestResult.success,
                message: "Lấy thông tin tất cả người dùng thành công",
                data: users
            });
        })
    } else {
        res.status(401).json({
            ok: constants.requestResult.failure,
            message: 'UNAUTHORIZED',
        })
    }

}

//Đăng ký
exports.create = async (req, res) => {
    const user = req.user
    if (user) {
        res.status(400).json({
            ok: constants.requestResult.failure,
            message: 'Số điện thoại đã được đăng ký'
        })
        return
    }

    let data = {
        phone: req.body.phone,
        name: req.body.name,
    }
    let password = req.body.password

    bcrypt.hash(password, null, null, (err, hash_password) => {
        if (err) {
            console.log(err, 'Lỗi')
            res.status(500).json({
                ok: constants.requestResult.failure,
                message: 'Internal Server'
            })
            return
        }

        Object.assign(data, { hash_password, created_at: new Date().getTime() })
        let user = new Users(data)
        user.save((err, newUser) => {
            if (err) {
                res.json({
                    ok: constants.requestResult.failure,
                    message: err
                })
                return
            }
            let payload = {
                id: newUser._id.toString(),
            }
            jwt.sign(payload, jwtConfig.jwtSecret, { expiresIn: jwtConfig.expiresIn }, (err, token) => {
                if (err) {
                    res.json({
                        ok: constants.requestResult.failure,
                        message: err
                    })
                    return
                }
                res.status(201).json({
                    ok: constants.requestResult.success,
                    message: 'Đăng ký thành công',
                    data: {
                        info: newUser,
                        token,
                    },
                })
            })
        })
    })
}

//lấy thông tin cá nhân
exports.getProfile = (req, res) => {
    if (!req.decode.user) {
        res.status(401).json({
            ok: constants.requestResult.failure,
            message: 'Người dùng không hợp lệ',
        })
        return
    }
    res.status(200).json({
        ok: constants.requestResult.success,
        message: 'Lấy thông tin thành công',
        data: req.decode.user
    })
}

//đăng nhập
exports.login = (req, res) => {
    const user = req.user
    if (!user) {
        res.status(400).json({
            ok: constants.requestResult.failure,
            message: 'Số điện thoại không tồn tại'
        })
        return
    }

    let password = req.body.password

    bcrypt.compare(password, user.hash_password, (err, checkPass) => {
        if (err) {
            res.status(401).json({
                ok: constants.requestResult.failure,
                message: 'Sai mật khẩu'
            })
            return
        }
        if (checkPass) {
            let payload = {
                id: user._id.toString(),
            }
            jwt.sign(payload, jwtConfig.jwtSecret, { expiresIn: jwtConfig.expiresIn }, (err, token) => {
                if (err) {
                    console.log(err)
                    return
                }
                res.status(200).json({
                    ok: constants.requestResult.success,
                    message: 'Đăng nhập thành công',
                    data: {
                        token: token,
                        info: user,
                    }
                })
            })
        } else {
            res.json({
                ok: constants.requestResult.failure,
                message: 'Sai mật khẩu'
            })
        }
    })

}