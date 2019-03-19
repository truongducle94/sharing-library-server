var AllBooks = require('../models/bookModel')

exports.getAll = (req, res) => {
    AllBooks.get((err, books) => {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
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
    book.save((err, res)=> {
        res.json({
            message: 'New book created!',
            data: book
        });
    })
}