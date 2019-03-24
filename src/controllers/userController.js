Users = require('../models/userModel')
const bcrypt = require('bcrypt')
var projectConst = require('../library/utils/constants')

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

function convertUserData(dataArray) {

}

//Lấy thông tin tất cả người dùng
exports.getAll = (req, res) => {
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
        bcrypt.hash(password, projectConst.saltRound, (err, hash_password) => {
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
                    res.json({
                        ok: projectConst.requestResult.success,
                        message: 'Đăng nhập thành công',
                        data: {
                            token: '',
                            info: user
                        }
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