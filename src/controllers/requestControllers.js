Request = require('../models/requestModel')
AllBooks = require('../models/bookModel')
var constants = require('../library/utils/constants')
var QRCode = require('qrcode')

exports.create = (req, res) => {
    const user = req.decode.user
    if (!user) {
        res.status(401).json({
            ok: projectConst.requestResult.failure,
            message: 'Người dùng không hợp lệ',
        })
        return
    }
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