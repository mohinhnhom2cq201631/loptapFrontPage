var express = require('express');
var router = express.Router();
var Product = require('../models/products');
var nOnePage = 8;
var nPage;
/* GET home page. */
router.get('/', function(req, res, next) {
    var page = req.query.page || 1;
    Product.find().countDocuments(function(err, docs) {
        var numPro = parseInt(docs);
        nPage = Math.floor(numPro / nOnePage);
        if (numPro % nOnePage) nPage++;
    });
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
module.exports = router;