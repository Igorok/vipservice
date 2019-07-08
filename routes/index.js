const express = require('express');
const router = express.Router();
const path = require('path');

const order = require(path.resolve(__dirname, '../models/orders.js')).order;

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.get('/orders', async (req, res, next) => {
    try {
        let orders = await order.getOrderList();
        res.render('orderList', { title: 'Orders', orders: orders });
    } catch (e) {
        next(e);
    }
});

router.get('/order/:id', async (req, res, next) => {
    try {
        let orderDetail = await order.getOrderDetail(req.params.id);
        res.render('orderDetail', { title: 'Orders', orderDetail: orderDetail });
    } catch (e) {
        next(e);
    }
});

module.exports = router;
