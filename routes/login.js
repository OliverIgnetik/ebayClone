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
    User.find({email:email}, (err,users)=>{
        if(err){
            res.json({
                confirmation:'fail',
                error:err
            })
            return 
        }
        if(users.length==0){
            res.json({
                confirmation:'fail',
                error:'Invalid email'
            })
            return 
        }

        const user = users[0];

        if(user.password!=req.body.password){
            res.json({
                confirmation:'fail',
                password:'incorrect password'
            })
            return
        }

        // this will only be reached once every test is passed
        res.json({
            confirmation:'success',
            user:users[0]
        })
    })
});

module.exports = router;