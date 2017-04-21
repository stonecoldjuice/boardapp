var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('connect-flash');

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var bcrypt = require('bcrypt-nodejs');
var passport = require('./config/passport');

mongoose.connect(process.env.MONGO_DB);

// database
var db = mongoose.connection;
db.once("open", function() {
    console.log("DB connected");
});
db.on("error", function(err) {
    console.log("DB ERROR :", err);
});

// view engine
app.set("view engine", 'ejs');

// middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({secret: 'MySecret'}));

// passport
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

// start server
app.listen(3000, function() {
    console.log('Server On!');
});