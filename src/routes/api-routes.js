let router = require('express').Router()

router.get('/', function (req, res) {
    console.log('ACBCBASKJSA')
    res.json({
        status: 'API Its Working',
        message: 'Welcome to SharingLibrary crafted with love!',
    });
});

var userController = require('../controllers/userController')
var bookController = require('../controllers/bookControllers')

router.route('/users')
    .get(userController.getAll)
    .post(userController.create);
router.route('/books')
    .get(bookController.getAll)
    .post(bookController.create)
router.post('/login', userController.login)
// Export API routes
module.exports = router