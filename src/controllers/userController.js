Users = require('../models/userModel')

exports.getAll = (req, res) => {
    Users.get((err, users) => {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "User retrieved successfully",
            data: users
        });
    })
}

exports.create = (req, res) => {
    let user = new Users()
    // user.name.first = req.body.name.first ? req.body.name.first : user.name.first;
    // user.name.last = req.body.name.last ? req.body.name.last : user.name.last;
    user.name = req.body.name ? req.body.name : user.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.phone = req.body.phone;
    user.gender = req.body.gender
    user.rank = req.body.rank
    user.point = req.body.point
    user.save((err, res)=> {
        res.json({
            message: 'New user created!',
            data: user
        });
    })
}