const express = require('express');
const Item = require('../models/Item');
const router = express.Router();


// ACCOUNT ROUTE IS CALLED UPON THE LOGIN ROUTE
// during the passport call
router.get('/', (req, res) => {
    // passport binds user to req.user
    const user = req.user;

    // just incase there is no user
    if (user == null) {
        res.redirect('/');
        return;
    }
    Model.find(null, (err, items) => {
        if (err) {
            return next(err)
        }
        // set the user as data to pass to account ejs template
        // reference object multiple times
        const data = {
            user: user,
            items: items
        }

        // Pass render a user object
        res.render('account', data);
    });

});

router.get('/logout', (req, res) => {
    // passport binds user to req.user
    req.logOut();
    res.json({
        confirmation: 'logged out',
    })
});

module.exports = router;