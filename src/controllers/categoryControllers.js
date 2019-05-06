BookCategory = require('../models/categoryModel')
AllBooks = require('../models/bookModel')
var constants = require('../library/utils/constants')

exports.getCategory = (req, res) => {
    const { limit } = req.query
    BookCategory.find(null, (err, categories) => {
        if (err) {
            res.json({
                ok: 0,
                message: err,
            });
            return
        }
        res.json({
            ok: 1,
            message: "Lấy danh mục sách thành công",
            data: categories
        });
    }).limit(parseInt(limit))
}

exports.createCategory = (req, res) => {
    if (req.decode.user.admin) {
        const { category_name } = req.body
        const data = { category_name }
        let category = new BookCategory(data)
        category.save((err, new_category) => {
            if (err) {
                res.json({
                    ok: constants.requestResult.failure,
                    message: err
                })
                return
            }
            res.status(201).json({
                ok: constants.requestResult.success,
                message: 'Create new book category',
                data: new_category,
            })
        })
    } else {
        res.status(401).json({
            ok: constants.requestResult.failure,
            message: 'UNAUTHORIZED',
        })
    }
}

exports.deleteCategory = (req, res) => {

}