var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);

//p fb_auth
const FacebookStrategy  = require('passport-facebook').Strategy;
const bodyParser = require('body-parser');
const config = require('./config/config');
const routes = require('./routes/authfb');
const app = express();

var mongoose = require('mongoose');
mongoose.set('useUnifiedTopology', true);
//connect mongoose
var mongoDB = 'mongodb+srv://nhom2:mohinhhoanhom2@cluster0-lq7bm.mongodb.net/loptap';
mongoose.connect(mongoDB, { useNewUrlParser: true });
//--
require('./config/passport');
//--
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// view engine setup
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views',
    partialsDir: [
        //  path to your partials
        path.join(__dirname, 'views/partials/')
    ]
}));


app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//
app.use(bodyParser.urlencoded({ extended: false })); //Parse body để get data
app.use(session({
  secret:'mysupersecret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie:{maxAge: 300*1000}
}));//-----------------------
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user;
    res.locals.session = req.session;
    next();
});
//-----------------------
//////

// app.use(session({ secret: 'keyboard cat', key: 'sid'}));  //Save user login

app.use('/users', usersRouter);
app.use('/', indexRouter);



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

/*config is our configuration variable.*/
passport.use(new FacebookStrategy({
    clientID: config.facebook_key,
    clientSecret:config.facebook_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      if(config.use_database) {
         //Further code of Database.
      }
      return done(null, profile);
    });
  }
));

// Passport session setup. 
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  
module.exports = app;