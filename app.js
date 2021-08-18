var createError = require('http-errors');
var express = require('express');
var path = require('path');
const flash = require('req-flash');
// var cookieParser = require('cookie-parser');
const session = require('express-session');
var logger = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
mongoose.connect('mongodb://localhost:27017/e-commerce', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (err) => console.log(err));
db.on('open', (err) => console.log('Database connected'));

var clientRouter = require('./routes/clients');
var adminRouter = require('./routes/admin');
const authenticateAdmin = require('./middlewares/authenticate-admin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }))
// app.use(cookieParser());
var sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))
app.use(function(req, res, next) {
  res.locals.userId = req.session.userId;
  next();
});
app.use(flash({locals: 'flash'}));

app.use('/', clientRouter);
app.use('/admin', authenticateAdmin, adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
