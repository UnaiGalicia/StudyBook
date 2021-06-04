var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const crypto = require('crypto'); //core node module that well use to give names to files
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var storageRouter = require('./routes/storage');
var perfilaRouter = require('./routes/perfila');
var komunitateaRouter = require('./routes/komunitatea');
var loginaRouter = require('./routes/logina'); // HAU ALDATU TONTO
var bilatuRouter = require('./routes/lookup');


require('./config/passport')(passport); //passporten konfigurazioa

//const uri = 'mongodb://localhost:27017/grid';
const uri = 'mongodb+srv://unai:unai@cluster0.cjatm.mongodb.net/StudyBook?retryWrites=true&w=majority';
const conn = mongoose.connect(uri, {
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex: true
}).catch(err => console.log(err))
mongoose.set('useFindAndModify', false);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));                     //horrela consolan ikusiko ditugu HTTP eskaera guztiak
app.use(cookieParser());                           //cookientzat
app.use(bodyParser.urlencoded({extended: false})) //ojo, bestean .json() dugu!
app.use(session({
  secret: 'iker',             //secret, hitz gakoa
  resave: false,              //por defecto
  saveUninitialized: false      //por defecto
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());       //http orrien arteko komunikazioa ahalbidetu??

app.use(express.json());
app.use(methodOverride('_method')); //to make delete requests
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/bulma', express.static(__dirname + '/node_modules/bulma/css/'));
app.use('/font', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free/'));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/storage',storageRouter);
app.use('/komunitatea',komunitateaRouter);
app.use('/perfila',perfilaRouter);
app.use('/logina',loginaRouter);
app.use('/bilatu', bilatuRouter);


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

app.listen(3000);

module.exports = app;
