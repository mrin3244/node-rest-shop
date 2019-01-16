const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

mongoose.connect("mongodb://localhost:27017/mydb", {useNewUrlParser:true});

mongoose.Promise = global.Promise;


// lock the log
app.use(morgan('dev'));

// get input from body
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS error handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-with, Content-type, Accept, Authorization'
        );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handel request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message
        }
    });
});

module.exports = app;