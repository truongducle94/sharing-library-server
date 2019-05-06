let router = require('express').Router()

router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to SharingLibrary crafted with love!',
    });
});

var userController = require('../controllers/userController')
var bookController = require('../controllers/bookControllers')
var requestController = require('../controllers/requestControllers')
var categoryController = require('../controllers/categoryControllers')
var authMiddleware = require('../middlewares/auth-middleware')
var validateMiddleware = require('../middlewares/validate-middleware')

// Đăng ký, đăng nhập
router.post('/register', validateMiddleware.validatePhone, userController.create)
router.post('/login', validateMiddleware.validatePhone, userController.login)

// Liên quan đến người dùng
router.route('/users')
    .get(authMiddleware.verifyJwt, userController.getAll)
router.route('/profile')
    .get(authMiddleware.verifyJwt, userController.getProfile)
    .put(authMiddleware.verifyJwt, userController.updateProfile)

router.route('/books')
    .get(bookController.getBook)
    .post(authMiddleware.verifyJwt, bookController.create)

router.route('/requests')
    .get(authMiddleware.verifyJwt, requestController.getRequest)
    .post(authMiddleware.verifyJwt, requestController.create)

router.route('/requests/:request_id')
    .get(authMiddleware.verifyJwt, requestController.getRequestById)

router.route('/confirm_request')
    .post(authMiddleware.verifyJwt, requestController.confirmRequest)

//category
router.route('/category')
    .get(categoryController.getCategory)
    .post(authMiddleware.verifyJwt, categoryController.createCategory)
// Export API routes
module.exports = router