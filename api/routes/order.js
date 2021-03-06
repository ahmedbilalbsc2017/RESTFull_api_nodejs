const express= require('express');
const mongoose = require('mongoose');
const router = express.Router ();

const checkAuth= require('../middleware/check-auth');
const OrdersController= require ('../controllers/orders');


router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.new_order_create);

router.get('/:orderId', checkAuth, OrdersController.order_get_one);

router.delete('/:orderId', checkAuth, OrdersController.order_delete);

module.exports = router;