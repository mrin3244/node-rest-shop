const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find().exec().then(docs => {res.status(200).json(docs)})
                      .catch(err =>{res.status(500).json(err)});
    /* res.status(300).json({
        "message": "user created"
    }); */
});
// signup or create new user ----------------------- start 
router.post('/signup', (req, res, next) => {
    User.find({"email": req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1){
                return res.status(409).json({
                    "message":"user exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err,hash) => {
                    if(err){
                        return res.status(500).json({
                            "error": err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        //res.status(201).json(user);
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    "message": "user created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    "error": err
                                })
                            }); 
                    }
                });
            }
        })
        .catch(err =>{res.status(500).json(err)});
    
    
});
// signup or create new user ----------------------- end

// login user ----------------------- start 
router.post('/login', (req, res, next) => {
    User.find({"email":req.body.email})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    "message":"Auth failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        "message":"Auth failed"
                    });  
                }
                if(result){
                    const token = jwt.sign(
                        {
                            "email": user[0].email,
                            "id": user[0]._id
                        }, 
                        'secret', //process.env.JWT_KEY //'secret'
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        "message":"Auth successful",
                        "token": token
                    });
                }
                return res.status(401).json({
                    "message":"Auth failed"
                });
            });
        })
        .catch(err => {
            res.status(500).json({"error": err});
        });
});
// login user ----------------------- end

// delete user ----------------------- start 
router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;

    User.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({"error": err});
        });
});
// delete user ----------------------- end

module.exports = router;