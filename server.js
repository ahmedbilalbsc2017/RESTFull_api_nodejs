const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const app = express();

const productRoutes= require('./api/routes/products');
const orderRoutes= require('./api/routes/order');
const userRoutes= require('./api/routes/user');

const port = process.env.PORT || 3000;

//db con
mongoose.connect('mongodb+srv://abc:' + process.env.MONGO_ATLAS_PW + '@shoping-dev.mtwxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });
//to avoid deprication warning
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

//to prevent cors errors write header access before routes
app.use((req,res,next)=>{
    // console.log("Request obj",req.body)
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Request-width, Content-Type, Accept, Autherization');
    if(req.method === 'OPTIONS'){
        console.log("Option Request")
        res.header('Access-Control-Allow-Methods','GET,PUT,POST,PATCH,DELETE');
        return res.status(200).json({res : "successful"});
    }
    //move to next 
    next()
});

//Routes
app.use('/products',productRoutes);
app.use('/order', orderRoutes);
app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error= new Error('Not Found!');
    error.status= 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
app.listen(port, console.log("Server Connected ",port));
