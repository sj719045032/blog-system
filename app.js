var express = require('express');
var session = require('express-session');
var logger = require('morgan');
var fs=require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var post = require('./routes/post');
var reg = require('./routes/reg');
var edit = require('./routes/edit');
var del = require('./routes/delete');
var comment=require('./routes/comment');
var search=require('./routes/search');
var reprint=require('./routes/reprint');
var filemanage=require('./routes/filemanage');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');

/*var fs = require('fs');
var accessLog = fs.createWriteStream(__dirname+'access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});*/
var app = express();
/*app.use(logger('combined', {stream: accessLog}));*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(session({secret: settings.cookieSecret, store: new MongoStore({db: settings.db}),proxy: true,
    resave: true,
    saveUninitialized: true}));
/*app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});*/
// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
var errorLogStream = fs.createWriteStream(__dirname + '/error.log', {flags: 'a'});
// setup the logger
app.use(logger('combined', {stream: accessLogStream}));
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/reg', reg);
app.use('/logout', logout);
app.use('/post', post);
app.use('/edit', edit);
app.use('/remove', del);
app.use('/search', search);
app.use('/reprint',reprint);
app.use('/filemanage',filemanage);
/*app.use('/comment', comment);*/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLogStream.write(meta + err.stack + '\n');
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
