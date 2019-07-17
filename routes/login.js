const express = require('express');
const User = require('../models/User');
const router = express.Router();

// get the login page
router.get('/', (req, res, next) => {
    // render the login file
    res.render('login',null);
});

router.post('/', (req, res, next) => {
    const email = req.body.email;
    User.findOne({email:email}, (err,user)=>{
        // Check for errors and pass to handler
        if(err){
            return next(err);
        }
        // user not found
        if(user== null){
            return next(new Error('User not found'));         
        }
        // check password
        if(user.password!=req.body.password){
            return next(new Error('incorrect password'));
        }

        // this will only be reached once every test is passed
        res.json({
            confirmation:'success',
            user:user
        })
    })
});

module.exports = router;