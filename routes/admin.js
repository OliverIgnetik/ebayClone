const express = require('express');
const Item = require('../models/Item');
const router = express.Router();


router.get('/', (req, res, next) => {
    // passport binds user to req.user
    const user = req.user;
    // just incase there is no user
    if (user == null) {
        res.redirect('/');
        return;
    }
    // unauthorized user
    if (user.isAdmin == false) {
        res.redirect('/')
        return
    }

    // fetch all the items 
    Item.find(null, (err, items) => {
       if(err){
           return next(err);
       } else{
         if(items.length === 0){
             console.log("There are no items")
         } else{
            const data = {
                user: user,
                items:items
            }
        
            res.render('admin', data);
         }
       }
    });
});

router.post('/additem', (req, res,next) => {
        // passport binds user to req.user
        const user = req.user;
        // just incase there is no user
        if (user == null) {
            res.redirect('/');
            return;
        }
        // unauthorized user
        if (user.isAdmin == false) {
            res.redirect('/')
            return
        }

        Item.create(req.body,(err,item)=>{
            if(err){
                return next(err)
            }

            res.redirect('/admin');
        })
});

module.exports = router;