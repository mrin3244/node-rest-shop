const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

router.get("/", (req, res, next) => {
    Product.find()
        .select('_id name price')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                Product: docs.map(doc =>{
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3210/products/'+doc._id
                        }
                    }
                })
            }
            res.status(201).json(response);
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({"error":"err"});
        });
});

router.post("/", checkAuth, (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                "message": "POST request to add a new products",
                "createdProduct": result
            }); 
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                "error": err
            });
        });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({"message": "data not found"});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            "error": err
        });
    });
});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
        
    }

    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({"error": err});
        });
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    const id = req.params.productId;

    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({"error": err});
        });
});

module.exports = router;