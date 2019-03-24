let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let path = require('path')
let apiRoutes = require('./routes/api-routes')

const app = express();

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost:27017/sharing_library');
var db = mongoose.connection;

// Setup server port
var port = process.env.PORT || 3000;


app.use('/api', apiRoutes)

app.use('/', function (req, res) {
    res.render('home')
})

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running SharingLibrary Server on port " + port);
});