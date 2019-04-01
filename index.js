let express = require('express');
let cors = require('cors')
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let path = require('path')
let apiRoutes = require('./src/routes/api-routes')

const app = express();

app.use(cors())

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
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://truongld:1Atruong%21%40@sharinglibrary-fs34l.gcp.mongodb.net/sharing_library', {useNewUrlParser: true});
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