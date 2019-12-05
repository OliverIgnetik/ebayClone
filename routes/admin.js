const express = require('express');
const Item = require('../models/Item');
const router = express.Router();

router.get('/', (req, res, next) => {
  // passport binds user to req.user
  const user = req.user;
  // just incase there is no user
  if (user == null) {
    // res.redirect('/');
    return next(new Error('Adminstrator access only'));
  }
  // unauthorized user
  if (user.isAdmin == false) {
    // res.redirect('/');
    return next(new Error('Adminstrator access only'));
  }

  // fetch all the items
  Item.find(null, (err, items) => {
    if (err) return next(err);
    else {
      const data = {
        user: user,
        items: items,
      };
      res.render('admin', data);
    }
  });
});

router.post('/additem', (req, res, next) => {
  // passport binds user to req.user
  const user = req.user;
  // just incase there is no user
  if (user == null) {
    // res.redirect('/');
    return next(new Error('Adminstrator access only'));
  }
  // unauthorized user
  if (user.isAdmin == false) {
    // res.redirect('/');
    return next(new Error('Adminstrator access only'));
  }

  Item.create(req.body, (err, item) => {
    if (err) {
      return next(err);
    }
    res.redirect('/admin');
  });
});

router.get('/removeitem/:itemid', (req, res, next) => {
  const user = req.user;
  // just incase there is no user
  if (user == null) {
    // remember redirect need specific path
    // res.redirect('/admin');
    return next(new Error('Adminstrator access only'));
  }

  // grab the id
  const itemid = req.params.itemid;

  Item.findOneAndDelete(itemid, err => {
    if (err) next(err);
    else res.redirect('/admin');
  });
});

module.exports = router;
