Request = require('../models/requestModel')
AllBooks = require('../models/bookModel')
var constants = require('../library/utils/constants')
var QRCode = require('qrcode')

exports.create = (req, res) => {
    const user = req.decode.user

    if (req.body.request_type === constants.request_type.borrow) {
        const book_id = req.body.data.book_id
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
                    book.status = constants.book_status.unavailable
                    book.save(function (err) {
                        if (err) {
                            res.status(500).json({ message: err });
                            return
                        }
                        let data = {
                            request_type: req.body.request_type,
                            user_id: user._id.toString(),
                            data: req.body.data,
                        }
                        let request = new Request(data)
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
                            return
                        })
                    });
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
    Request.findOne({ _id: request_id }, (err, request) => {
        if (err) {
            res.status(404).json({
                ok: constants.requestResult.failure,
                message: 'Request not found!!!'
            })
            return
        }
        if (request.status === constants.request_status.pending) {
            if (request.request_type === constants.request_type.borrow) {
                request.status = constants.request_status.accepted
                request.save(err => {
                    if (err) {
                        res.status(500).json({ message: err });
                        return
                    }
                    res.status(200).json({
                        ok: constants.requestResult.success,
                        message: 'Mượn sách thành công'
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

    Request.find(data, (err, requests) => {
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
    const {request_id} = req.params
    const user = req.decode.user
    console.log()
    Request.findById(request_id,(err, request) => {
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