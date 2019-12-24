const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://nhom2:mohinhhoanhom2@cluster0-lq7bm.mongodb.net/loptap';

var Product = require('../models/products');
var Component=require('../models/components');
var Brand = require('../models/brands');
var productDAO = require('../models/DAO/productDAO');
var brandDAO=require('../models/DAO/brandDAO')
var Cart =require('../models/cart')

//  xem chi tiết sản phẩm
exports.product_detail = async function(req, res) {
    const data = await productDAO.get_Product_By_ID(req.params.id);
	res.render('detailProduct', {
		title: 'Chi tiết sản phẩm',
		data : data
	});
};

exports.product_cart = async function(req, res) {
    const brandList = brandDAO.get_Brand_List();
    if(!req.session.cart){
        res.render('cart', {
            brandList: await brandList,
            curCustomer: req.user
    });
    }
    else{
        const cartCreate = new Cart(req.session.cart);
        res.render('cart', {
            brandList: await brandList,
            curCustomer: req.user,
            /*cartProducts: await cart.generateArray(),
            cartTotalPrice: req.session.cart.totalPrice*/
            cart: cartCreate
        });
    }
};

exports.product_addToCart = async function(req, res) {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {items:[]});

    await Product.findById(productId,async function(err,product){
        if(err) { return res.redirect('/');}//xử lý tạm, đúng là là nên có thông báo
        await cart.add(product);
        req.session.cart = await cart;
        res.redirect('../../cart');
    })
};
