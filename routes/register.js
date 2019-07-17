const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', (req, res,next) => {
    // you can just pass the user as an object
    // mongoose will fit the fields as required
    User.create(req.body,(err,user)=>{
        if (err){
            res.json({
                confirmation:'failed',
                error:err
            })
            return
        }
        // success pass back user
        res.json({
            confirmation: 'success',
            user:user
        })
    })
});

module.exports = router;