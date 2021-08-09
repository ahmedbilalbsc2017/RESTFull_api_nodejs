const mongoose= require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req,res,next)=>{
    Order.find().select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs =>{ 
        console.log('testing order list');
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc =>{
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/order/' + doc._id
                    }
                }
            })
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
} 

exports.new_order_create= (req,res,next)=>{
    Product.findById(req.body.productId).then(product =>{
        if(!product){
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order= new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save();
        }).then( result =>{
            console.log(result);
            res.status(201).json({
                message: 'Placed Order',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/order/' + result._id
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });    
}

exports.order_get_one= (req,res,next)=>{
    Order.findById(req.params.orderId)
    .populate('product', 'name')
    .exec()
    .then(order =>{
        if(!order){
            return res.status(404).json({
                message: 'Order not found'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/order/'
            }
        });
    })
    .catch(err => {
     res.status(500).json({
        error : err
     });
    });
}

exports.order_delete= (req,res,next)=>{
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Order has been deleted',
            url: 'http://localhost:3000/order',
            body: { productId: 'ID', quantity: 'Number' }
        });
    })
    .catch();
}