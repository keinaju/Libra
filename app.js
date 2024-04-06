const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

const app = express();

// Set up rate limiter (max.100 per minute) to all requests
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,
});
app.use(limiter);

// Set CSP headers to allow Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  }),
);

//Set up Mongoose-connection
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const dev_db_url = "";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

//Compress all routes
app.use(compression());

//View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const indexRouter = require('./routes/index');
app.use('/', indexRouter);
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);
const catalogRouter = require('./routes/catalog');
app.use('/catalog', catalogRouter);

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Error handler
app.use(function(err, req, res, next) {
  //Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
