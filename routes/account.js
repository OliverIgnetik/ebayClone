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
    Item.find(null, (err, items) => {
        if (err) {
            return next(err)
        }

        // nested query to check for items you're interested in 
        Item.find({
            interested: user._id
        }, (err, interestedItems) => {
            if (err) return next(err);

            const data = {
                user: user,
                items: items,
                interested: interestedItems
            }

            // Pass render a object
            res.render('account', data);

        });
    });

});

router.get('/additem/:itemid', (req, res, next) => {
    // passport binds user to req.user
    const user = req.user;

    // just incase there is no user
    if (user == null) {
        res.redirect('/');
        return;
    }

    // grab the id
    const itemid = req.params.itemid;

    Item.findById(itemid, (err, item) => {
        if (err) return next(err);

        if (item.interested.indexOf(user._id) == -1) {
            item.interested.push(user._id);
            // save the item after you add the interested user id
            item.save();
            // redirect requires you specify full path
            res.redirect('/account');
        }

        res.redirect('/account');

    })
});

router.get('/removeitem/:itemid', (req, res, next) => {
    // passport binds user to req.user
    const user = req.user;

    // just incase there is no user
    if (user == null) {
        res.redirect('/');
        return;
    }

    // grab the id
    const itemid = req.params.itemid;

    Item.findById(itemid, (err, item) => {
        if (err) return next(err);
        // remove item from array
        let index = item.interested.indexOf(user._id);
        if (index > -1) {
            item.interested.splice(index, 1);
        }
        // save the item after you add the interested user id
        item.save();
        // redirect requires you specify full path
        res.redirect('/account');

    })
});

router.get('/logout', (req, res) => {
    // passport binds user to req.user
    req.logOut();
    res.json({
        confirmation: 'logged out',
    })
});

module.exports = router;