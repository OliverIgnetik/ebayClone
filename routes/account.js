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

router.get('/additem/:itemid', (req, res,next) => {
    // passport binds user to req.user
    const user = req.user;

    // just incase there is no user
    if (user == null) {
        res.redirect('/');
        return;
    }

    // grab the id
    const itemid =req.params.itemid;
    
    Item.findById(itemid,(err,item)=>{
    if(err) return next(err);
    
    if(item.interested.indexOf(user._id)==-1){
        item.interested.push(user._id);
        // save the item after you add the interested user id
        item.save();
    }

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