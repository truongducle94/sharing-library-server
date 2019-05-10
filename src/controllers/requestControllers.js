Requests = require('../models/requestModel')
AllBooks = require('../models/bookModel')
Users = require('../controllers/userController')
var constants = require('../library/utils/constants')
var QRCode = require('qrcode')

function countPointByBorrowTime(time) {
    if (time < 0) {
        return 0
    }
    if (0 < time <= 1) {
        return constants.penalty_point.less_than_one
    }
    if (1 < time <= 2) {
        return constants.penalty_point.less_than_two
    }
    if (2 < time <= 3) {
        return constants.penalty_point.less_than_three
    }

    return constants.penalty_point.over_than_three
}

function checkTimeBorrow(time, user_rank) {
    let out_date_time
    switch (user_rank) {
        case constants.userRanking.bronze:
            out_date_time = time - constants.borrow_limit.bronze
            break;

        case constants.userRanking.silver:
            out_date_time = time - constants.borrow_limit.silver
            break;

        case constants.userRanking.gold:
            out_date_time = time - constants.borrow_limit.gold
            break;

        default: break;
    }

    const penalty = countPointByBorrowTime(out_date_time)
    return penalty
}

// req.data should be: {
//     user_id, user_rank, data
// }
exports.create = (req, res) => {
    const user = req.decode.user

    if (req.body.request_type === constants.request_type.borrow) {
        const { book_id } = req.body.data
        AllBooks.findOne({ _id: book_id }, function (err, book) {
            if (err) {
                res.status(404).json({
                    ok: constants.requestResult.failure,
                    message: 'Book not found!!!'
                })
                return
            }
            if (!!book) {
                if (book.status === constants.book_status.available) {
                    let request_data = {
                        request_type: req.body.request_type,
                        user_id: user._id.toString(),
                        user_rank: user.rank,
                        data: req.body.data,
                    }
                    let request = new Requests(request_data)
                    Object.assign(request, { created_at: new Date().getTime().toString() })
                    request.save(function (err, newRequest) {
                        if (err) {
                            res.status(500).json({ message: err });
                            return
                        }
                        res.status(200).json({
                            ok: constants.requestResult.success,
                            message: 'Yêu cầu đã được gửi. Đang xử lý!!!',
                            data: {
                                request_id: newRequest._id.toString()
                            }
                        })
                        book.status = constants.book_status.unavailable
                        book.on_request_id = newRequest._id.toString()
                        book.updated_at = new Date().getTime().toString()
                        book.save(function (err) {
                            console.log(err)
                        });
                        return
                    })
                } else {
                    res.status(400).json({
                        ok: constants.requestResult.failure,
                        message: 'Sách không thể mượn'
                    })
                }
            } else {
                res.status(404).json({
                    ok: constants.requestResult.failure,
                    message: 'Không tồn tại sách này'
                })
            }
        })
    }
}

exports.confirmRequest = (req, res) => {
    const user = req.decode.user

    const request_id = req.body.request_id
    Requests.findOne({ _id: request_id }, (err, request) => {
        if (err) {
            res.status(404).json({
                ok: constants.requestResult.failure,
                message: 'Request not found!!!'
            })
            return
        }

        if (request.user_id != user._id.toString()) {
            res.status(401).json({
                ok: constants.requestResult.failure,
                message: 'Người dùng không hợp lệ!'
            })
            return
        }

        if (request.status === constants.request_status.pending) {
            if (request.request_type === constants.request_type.borrow) {
                request.status = constants.request_status.accepted
                request.updated_at = new Date().getTime().toString()
                request.save((err, updatedRequest) => {
                    if (err) {
                        res.status(500).json({ message: err });
                        return
                    }
                    res.status(200).json({
                        ok: constants.requestResult.success,
                        message: 'Mượn sách thành công',
                        data: updatedRequest.data,
                    })
                    return
                })
            }
        } else {
            res.status(400).json({
                ok: constants.requestResult.failure,
                message: 'Yêu cầu không hợp lệ'
            })
            return
        }
    })
}

//tra sach
exports.giveBookBack = (req, res) => {
    const { book_id } = req.body

    AllBooks.findOne({ _id: book_id }, (err, book) => {
        if (err) {
            res.json({
                ok: constants.requestResult.failure,
                message: 'BAD REQUEST',
            })
            return
        }
        const request_id = book.on_request_id
        Requests.findById(request_id, (err, request) => {
            if (err) {
                res.json({
                    ok: 0,
                    message: err,
                });
                return
            }
            if (request.status === constants.request_status.accepted) {
                const time_borrowed = parseInt(request.updated_at)
                //update request
                request.status = constants.request_status.finished
                request.updated_at = new Date().getTime().toString()
                request.save((err, updatedRequest) => {
                    if (err) {
                        res.json({
                            ok: 0,
                            message: err,
                        });
                        return
                    }
                    res.json({
                        ok: constants.requestResult.success,
                        message: 'Trả sách thành công',
                    });

                    // update book_status
                    book.status = constants.book_status.available
                    book.updated_at = new Date().getTime().toString()
                    book.on_request_id = ''
                    book.save((err) => {
                        //need to push notify confirm return book here....
                    })

                    //update user_point
                    const time_returned = parseInt(updatedRequest.updated_at)
                    let distance = (time_returned - time_borrowed) / constants.ms_per_day
                    const penalty_point = checkTimeBorrow(distance)
                    console.log(penalty_point, 'AAAAAAAAAAAA')
                    Users.findById(updatedRequest.user_id, (err, user) => {
                        user.point = user.point - penalty_point
                        user.save(err => {
                            if (penalty_point > 0) {
                                //push notify.....
                            }
                        })
                    })
                })
            } else {
                res.json({
                    ok: constants.requestResult.failure,
                    message: 'BAD REQUEST',
                })
                return
            }
        })
    })
}

//Lấy danh sách yêu cầu bản thân theo params
exports.getRequest = (req, res) => {
    const user = req.decode.user
    const { status, page, per_page, request_type } = req.query
    let limitNumber
    let skipNumber
    let data = { user_id: user._id }
    if (!!status) {
        Object.assign(data, { status })
    }
    if (!!request_type) {
        Object.assign(data, { request_type })
    }
    if (!!parseInt(per_page)) {
        if (!!parseInt(page)) {
            limitNumber = parseInt(per_page) * parseInt(page)
            skipNumber = parseInt(per_page) * (parseInt(page) - 1)
        }
        else {
            limitNumber = parseInt(per_page)
        }
        console.log(limitNumber, 'limit')
        console.log(skipNumber, 'skip')
    }

    Requests.find(data, (err, requests) => {
        if (err) {
            res.json({
                ok: 0,
                message: err,
            });
            return
        }
        res.json({
            ok: 1,
            message: "Get list request success",
            data: requests
        });
    }).skip(skipNumber).limit(limitNumber)
}

exports.getRequestById = (req, res) => {
    const { request_id } = req.params
    const user = req.decode.user
    Requests.findById(request_id, (err, request) => {
        if (err) {
            res.json({
                ok: 0,
                message: err,
            });
            return
        }
        if (request.user_id != user._id) {
            res.status(400).json({
                ok: 0,
                message: 'Người dùng không hợp lệ'
            })
            return
        }
        res.json({
            ok: 1,
            message: "Get request success",
            data: request
        });
    })
}