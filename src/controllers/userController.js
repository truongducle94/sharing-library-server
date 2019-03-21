Users = require('../models/userModel')

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

exports.getAll = (req, res) => {
    Users.get((err, users) => {
        if (err) {
            res.json({
                ok: 0,
                message: err,
            });
        }
        res.json({
            ok: 1,
            message: "User retrieved successfully",
            data: users
        });
    })
}

exports.create = async (req, res) => {
    let name = req.body.name ? req.body.name : user.name;
    let email = req.body.email;
    let password = req.body.password;
    let phone = req.body.phone;
    let gender = req.body.gender
    let rank = req.body.rank
    let point = req.body.point
    const checkEmail = await onCheckingEmail(email)
    if (checkEmail) {
        console.log(checkEmail)
        let user = new Users({
            name: name,
            email: email,
            password: password,
            phone: phone,
            gender: gender,
            rank: rank,
            point: point
        })
        user.save((err) => {
            if (err) res.json({
                ok: 0,
                message: err
            })
            res.json({
                ok: 1,
                message: 'New user created!',
                data: user
            });
        })
    } else res.json({
        ok: '0',
        message: 'Email đã tồn tại'
    })
}