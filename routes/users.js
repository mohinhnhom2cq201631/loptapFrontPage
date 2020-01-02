var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var brandDAO=require('../models/DAO/brandDAO')
var Cart =require('../models/cart')
var Order=require('../models/orders')
var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('user/profile', { user: req.user });
});
router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout();
    res.redirect('/');
});
//------------
router.use('/', notLoggedIn, function(req, res, next) {
    next();
});

router.get('/sign-in', (req, res, next) => {
    var messages = req.flash('error');
    res.render('signIn', {
        csrfToken: req.csrfToken(),
        layout: false,
        messages: messages,
        hasError: messages.length > 0
    });
});
router.post('/sign-in', passport.authenticate('local.signin', {
    successRedirect: '/',
    failureRedirect: '/users/sign-in',
    failureFlash: true
}));
router.get('/sign-up', (req, res, next) => {
    var messages = req.flash('error');
    res.render('signUp', {
        csrfToken: req.csrfToken(),
        layout: false,
        messages: messages,
        hasError: messages.length > 0
    });
});
router.post('/sign-up', passport.authenticate('local.signup', {
    successRedirect: '/',
    failureRedirect: '/users/sign-up',
    failureFlash: true
}));

module.exports = router;


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!(req.isAuthenticated())) {
        return next();
    }
    res.redirect('/');
}