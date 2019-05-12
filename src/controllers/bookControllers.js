AllBooks = require('../models/bookModel')
var constants = require('../library/utils/constants')
var QRCode = require('qrcode')
var multer = require('multer')

var book_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/books')
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.png`)
    }
})
var uploadBook = multer({ storage: book_storage }).fields([{ name: 'front_image', maxCount: 1 }, { name: 'back_image', maxCount: 1 }])

//Lấy danh sách book
exports.getBook = (req, res) => {
    const { category_id, page, per_page } = req.query
    let data = {}
    let limitNumber
    let skipNumber
    if (!!category_id) {
        data = Object.assign(data, { category_id })
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
    AllBooks.find(data, (err, books) => {
        if (err) {
            res.json({
                ok: 0,
                message: err,
            });
        }
        res.json({
            ok: 1,
            message: "Book retrieved successfully",
            data: books
        });
    }).skip(skipNumber).limit(limitNumber)
}

//Tạo mới book
exports.create = (req, res) => {
    uploadBook(req, res, function (error) {
        if (error) {
            res.status(400).json({
                ok: 0,
                message: 'BAD REQUEST'
            })
            return
        }
        if (!req.decode.user.admin) {
            res.status(401).json({
                ok: constants.requestResult.failure,
                message: 'UNAUTHORIZED',
            })
            return
        }

        if (!req.body.name) {
            res.status(400).json({
                ok: constants.requestResult.failure,
                message: 'Tên sách không được bỏ trống'
            })
            return
        }
        if (!req.body.author) {
            res.status(400).json({
                ok: constants.requestResult.failure,
                message: 'Tên tác giả không được bỏ trống'
            })
            return
        }

        if (!req.body.category_id) {
            res.status(400).json({
                ok: constants.requestResult.failure,
                message: 'Danh mục không được bỏ trống',
            })
            return
        }

        if (!req.body.description || req.body.description.length < 50) {
            res.status(400).json({
                ok: constants.requestResult.failure,
                message: 'Mô tả sách cần ít nhất 50 ký tự'
            })
            return
        }

        if (!req.files || !req.files['back_image'] || !req.files['front_image']) {
            res.status(400).json({
                ok: constants.requestResult.failure,
                message: 'Sách cần có đủ 2 ảnh bìa'
            })
            return
        }

        let book = new AllBooks(req.body)
        book.front_image = req.files['front_image'][0].filename
        book.back_image = req.files['back_image'][0].filename
        book.created_at = new Date().getTime()
        book.save((err, book) => {
            if (err) {
                res.status(500).json({
                    ok: 0,
                    message: err
                })
                return
            }
            res.status(201).json({
                ok: 1,
                message: 'New book created!',
                data: book
            });
        })
    })

}