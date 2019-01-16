const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({
        message : 'GET request /orders'
    });
});

router.post("/", (req, res, next) => {
    const order = {
        productId: req.body.productId,
        qty: req.body.qty
    };
    res.status(201).json({
        message : 'POST request to a orders',
        order: order
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    if(id === 'special'){
        res.status(200).json({
            message: 'you show an Id for order',
            id: req.params.orderId
        });
    }
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'deleted order!'
    });
});

module.exports = router;