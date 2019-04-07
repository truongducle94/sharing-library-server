let express = require('express');
let cors = require('cors')
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let path = require('path')
let apiRoutes = require('./src/routes/api-routes')
let config = require('./src/config/config')
var multer = require('multer')

const app = express();

app.use(cors())

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({ extended: true }))
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

//upload file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage }).single('user_avatar')

// Connect to Mongoose and set connection variable
const uri = config.mongodb_uri

mongoose.set('useCreateIndex', true)
mongoose.connect(uri, { useNewUrlParser: true });
var db = mongoose.connection;

// Setup server port
var port = process.env.PORT || 5000;


app.use('/api', apiRoutes)

app.post('/addimage', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
           res.status(400).json({
               ok: 0,
               message: 'lỗi'
           })
        } else  {
           res.status(200).json({
               ok: 1,
               message:'Upload thành công'
           })
        }
    })
    res.status(200).json({
        ok: 1,
        message:'Upload thành công'
    })
})

app.use('/', function (req, res) {
    res.render('home')
})

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running SharingLibrary Server on port " + port);
});