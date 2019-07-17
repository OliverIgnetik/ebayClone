const express = require('express');
const passport = require('passport');
const router = express.Router();

router.post('/',passport.authenticate('localRegister',{
    successRedirect:'/account',
}))

module.exports = router;