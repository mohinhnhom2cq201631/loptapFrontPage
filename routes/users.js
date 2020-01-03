var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var orderDAO=require('../models/DAO/orderDAO')
const User = require('../models/users')
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://nhom2:mohinhhoanhom2@cluster0-lq7bm.mongodb.net/loptap';

// var csrfProtection = csrf();
// router.use(csrfProtection);

router.get('/profile', isLoggedIn, async (req, res, next) => {
    let orders = await orderDAO.get_Order_List_By_UserID(req.user.id)
    res.render('user/profile', { 
        user: req.user,
        info: req.user.info,
        orders: orders
    });
});

router.post('/profile', isLoggedIn, async (req, res, next)=>{
    mongoose.connect(mongoDB, function(error) {
        if (error) throw error;
        let id = mongoose.Types.ObjectId(req.user.id);

        User.findOne({ _id: id }, function(err, foundUser) {
            if (err) {
				console.log(err);
				res.status(500).send();
			}
			else {
				if (!foundUser) {
					res.status(404).send();
				}
				else {
					foundUser.info.name = req.body.name;
					foundUser.info.address = req.body.address;
					foundUser.info.sdt = req.body.sdt;

					foundUser.save(function(err) {
						if (err) throw err;
						res.redirect('/');
					});
				}
			}
        });
    });
})

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
        //csrfToken: req.csrfToken(),
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
        //csrfToken: req.csrfToken(),
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