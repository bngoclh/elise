var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// connect to MongoDB
require('./config/db.config');
var indexRouter = require('./routes');
var usersRouter = require('./routes/user.route');
var authRouter = require('./routes/auth.route');
var commentRouter = require('./routes/comment.route');

var app = express();
var passport = require('passport');
var session = require('express-session');

const secret = process.env.JWT_SECRET || 'secret';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: secret, // Replace with a long, random string
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session(
    { secret: secret }
));

const User = require('./models/user.model');

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    User.authenticate(), // username, password
    ));

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


// routes
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// use Helmet middleware
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'"], // Allow scripts from the same origin
    }
  }
}));

// use Rate Limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


module.exports = app;
