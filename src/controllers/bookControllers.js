var AllBooks = require('../models/bookModel')

exports.getAll = (req, res) => {
    AllBooks.get((err, books) => {
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
    })
}

exports.create = (req, res) => {
    let book = new AllBooks()
    book.name = req.body.name ? req.body.name : book.name;
    book.author = req.body.author;
    book.kind = req.body.kind;
    book.status = req.body.status;
    book.save((err) => {
        if (err) res.json({
            ok: 0,
            message: err
        })
        res.json({
            ok: 1,
            message: 'New book created!',
            data: book
        });
    })
}