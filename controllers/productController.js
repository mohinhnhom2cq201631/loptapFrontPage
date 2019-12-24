const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://nhom2:mohinhhoanhom2@cluster0-lq7bm.mongodb.net/loptap';

var Product = require('../models/products');
var Component=require('../models/components');
var Brand = require('../models/brands');
var productDAO = require('../models/DAO/productDAO');

//  xem chi tiết sản phẩm
exports.product_detail = async function(req, res) {
    const data = await productDAO.get_Product_By_ID(req.params.id);
	res.render('detailProduct', {
		title: 'Chi tiết sản phẩm',
		data : data
	});
};

