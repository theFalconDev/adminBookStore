const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exhbs = require("express-handlebars")
const session = require("express-session")
const mongodbStore = require("connect-mongodb-session")(session)

const sessionMiddleware = require("./middleware/session")
console.log(sessionMiddleware);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

const app = express();


//config
require('dotenv').config({ path: './.env' })

// view engine setup

const hbs = exhbs.create({
  defaultLayout:"main",
  extname: "hbs",
  runtimeoptions:{
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true
  }
})

const store = mongodbStore({
  collection:"session",
  uri: process.env.MONGO_URI,

})

app.engine("hbs" , hbs.engine)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(session({
  secret : process.env.SECRET_KEY,
  resave: false,
  saveUninitialized:false,
  store
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessionMiddleware)

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

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

module.exports = app;
