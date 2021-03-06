var passport = require('passport');
var User = require('../models/users');
var localStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/config');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    User.findOne({ 'username': username }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Tên tài khoản này đã được đăng kí.' });
        }
        var newUser = new User();
        newUser.username = username;
        newUser.password = newUser.generateHash(password);
        newUser.email = req.body.email;
        newUser.info.address = req.body.address;
        newUser.info.sdt = req.body.sdt;
        newUser.info.name = req.body.name;
        newUser.save(function(err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    User.findOne({ 'username': username }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'Tài khoản không tồn tại.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Mật khẩu không chính xác.' });
        }
        return done(null, user);
    });
}));

passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: keys.callback_url
    }, (accessToken, refreshToken,profile, done) => {
      // Check if google profile exist.
      console.log(profile)
      if (profile.id) {
        User.findOne({googleId: profile.id})
          .then((existingUser) => {
            if (existingUser) {
              done(null, existingUser);
            } else {
            
            var newUser = new User();
            newUser.googleId = profile.id;
            newUser.info.name = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.save(function(err, result) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
            }
          })
      }
    })
  );