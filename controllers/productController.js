const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://nhom2:mohinhhoanhom2@cluster0-lq7bm.mongodb.net/loptap';

const Product = require('../models/products');
const Component=require('../models/components');
const Brand = require('../models/brands');
const productDAO = require('../models/DAO/productDAO');
const brandDAO=require('../models/DAO/brandDAO')
const Cart =require('../models/cart')
const Order = require('../models/orders')

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

exports.product_removeFromCart = async function(req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {items:{}});
    var productRemoved = await Product.findById(productId);

    productRemoved.size = req.body.removeSize;

    await cart.remove(productRemoved);
    req.session.cart = cart;
    res.redirect('/cart');
};

exports.checkout_post = async function (req, res) {
    if(!req.session.cart){
        res.redirect('/cart')
    }
    const cart = new Cart(req.session.cart)
    console.log(cart)
    var order = new Order({
        _id: new mongoose.Types.ObjectId(),
        user: req.user._id,
        cart: cart,
        payment:'Ship COD',
        created: new Date().toLocaleDateString(),
        status: 'Chưa giao'
    });
    
    order.save(function(error){
        if(error) throw error;
        req.flash('success','Giao dịch thành công !! Cám ơn bạn :D!!');
        req.session.cart = null;
        res.redirect('/thankyou');
    });
}

exports.thank_you = async function (req,res){
    var successMsg = req.flash('success')[0];
    res.render('thankyou', {
        pageTitle: 'Cám ơn bạn',
        successMsg: successMsg
    })
}