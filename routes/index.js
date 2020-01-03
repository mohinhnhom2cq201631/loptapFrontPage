var express = require('express');
var passport = require('passport');
var router = express.Router();
var Product = require('../models/products');
var Component=require('../models/components');
var Brand = require('../models/brands');
var User = require('../models/users');
var productController=require('../controllers/productController');
var nOnePage = 8;
var nPage;

/* GET home page. */
router.get('/', function(req, res, next) {
    var page = req.query.page || 1;
    Product.find().estimatedDocumentCount(function(err, docs) {
        var numPro = parseInt(docs);
        nPage = Math.floor(numPro / nOnePage);
        if (numPro % nOnePage) nPage++;
    }).then(function() {
        var isFirst = false;
        var isLast = false;
        var prePage = parseInt(page) - 1;
        if (prePage <= 0) {
            prePage = 1;
            isFirst = true;
        }
        var nextPage = parseInt(page) + 1;
        if (nextPage > nPage) {
            nextPage = parseInt(nPage);
            isLast = true;
        }
        var pages = [];
        for (i = 1; i <= nPage; i++) {
            var active = false;
            if (page == i) active = true;
            var obj = {
                value: i,
                active
            }
            pages.push(obj);
        }
        Product.find(function(err, docs) {
            var productChuck = [];
            var chucksize = 4;
            for (var i = 0; i <= docs.length; i += chucksize) {
                productChuck.push(docs.slice(i, i + chucksize));
            }
            res.render('index', { title: 'Laptop Shop', products: productChuck, pages, prePage, nextPage, isFirst, isLast });
        }).limit(nOnePage).skip(nOnePage * (page - 1));
    });
});


var countJson = function(json) {
    var count = 0;
    for (var id in json) {
        count++;
    }

    return count;
}

router.get('/chi-tiet/:id.html', productController.product_detail);
//GET cart page
router.get('/cart', productController.product_cart);
//GET add product to cart
router.post('/cart/add/:id', productController.product_addToCart);
//GET remove product from cart
router.post('/cart/remove/:id', productController.product_removeFromCart);

router.post('/checkout',isLoggedIn,productController.checkout_post)
router.get('/thankyou',isLoggedIn,productController.thank_you)
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    function(req, res) {
        res.redirect('/');
});
router.get('/api/current_user', (req, res) => {res.send(req.user);});

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