var express = require('express');
var router = express.Router();
var Product = require('../models/products');
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

//  xem chi tiết sản phẩm
router.get('/chi-tiet/:id.html', function(req, res) {
    Product.findById(req.params.id).then(function(data) {
        Product.find({ _id: { $ne: data._id } }).limit(4).then(function(pro) {
            res.render('detailProduct', { title: 'Laptop Detail', data: data, product: pro });
        });
    });

});


router.get('/sign-in', (req, res) => {
    res.render('signIn', {
        layout: false
    })
});
module.exports = router;