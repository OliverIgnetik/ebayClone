
const express = require('express');
const mailgunJs = require('mailgun-js');
const Item = require('../models/Item');
const User = require('../models/User');
const router = express.Router();
const bcryptjs = require('bcryptjs');



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


    })
});

router.get('/removeitem/:itemid', (req, res, next) => {
    // passport binds user to req.user
    const user = req.user;

    // just incase there is no user
    if (user == null) {
        // remember redirect need specific path
        res.redirect('/account');
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

router.post('/passwordReset', (req, res,next) => {
    // store the email
    const email = req.body.email;

    // find this user
    User.findOne({email:email},(err,user)=>{
        if(err) return next(err)
        
        // create nonce
        user.nonce = bcryptjs.hashSync('reset').slice(0,10);
        user.passwordResetTime = new Date();
        user.save();

        const mailgun=mailgunJs({
            apiKey:process.env.MAILGUNAPI,
            domain:process.env.DOMAIN
        });

        const data= {
            to : email,
            from: 'olli@ozemail.com.au',
            sender:'Sample Store',
            subject:'Password reset request',
            html:`Please <a href="http://localhost:5000/account/passwordReset?nonce=`+user.nonce+`&id=`+user._id+`">click here</a> to reset your password. This link is valid for 24 hours`
        };

        mailgun.messages().send(data,(err,body)=>{
            if (err) return next(err);

            // successful
            res.json({
                user:user
            });
        })

    })

    // send an email to their account
});
router.get('/logout', (req, res) => {
    
    // passport binds user to req.user
    req.logOut();
    res.redirect('/');
});

module.exports = router;