const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();


// get the login page
router.get('/', (req, res, next) => {
    // render the login file
    res.render('login',null);
});

router.post('/', passport.authenticate('localLogin',{
    successRedirect:'/account',
    failureRedirect:'/login'
}));

module.exports = router;