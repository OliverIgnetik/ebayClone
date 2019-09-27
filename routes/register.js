const express = require('express');
const passport = require('passport');
const router = express.Router();


// get the register page
router.get('/', (req, res, next) => {
    // render the login file
    res.render('register',null);
});

router.post('/',passport.authenticate('localRegister',{
    successRedirect:'/account',
}))

module.exports = router;