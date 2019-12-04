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
      return next(err);
    }

    // nested query to check for items you're interested in
    Item.find({ interested: user._id }, (err, interestedItems) => {
      if (err) return next(err);

      const data = {
        user: user,
        items: items,
        interested: interestedItems,
      };

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
  });
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
    if (err) next(err);
    // remove item from array
    let index = item.interested.indexOf(user._id);
    if (index > -1) {
      item.interested.splice(index, 1);
    }
    // save the item after you add the interested user id
    item.save();
    // redirect requires you specify full path
    res.redirect('/account');
  });
});

router.post('/passwordReset', (req, res, next) => {
  // store the email
  const email = req.body.email;

  // find this user
  User.findOne({ email: email }, (err, user) => {
    if (err) return next(err);

    // create nonce
    user.nonce = bcryptjs.hashSync('reset').slice(0, 10);
    user.passwordResetTime = new Date();
    user.save();

    const mailgun = mailgunJs({
      apiKey: process.env.MAILGUNAPI,
      domain: process.env.DOMAIN,
    });

    const data = {
      to: email,
      from: 'olli@ozemail.com.au',
      sender: 'Sample Store',
      subject: 'Password reset request',
      html: `Please 
      <a href="http://localhost:3000/account/passwordReset?nonce=${user.nonce}&id=${user._id}">
        click here
      </a> to reset your password. This link is valid for 24 hours`,
    };

    mailgun.messages().send(data, (err, body) => {
      if (err) return next(err);

      // successful
      res.json({
        user: user,
      });
    });
  });

  // send an email to their account
});

router.get('/passwordReset', (req, res, next) => {
  // user who has recieved an email
  const nonce = req.query.nonce;
  const id = req.query.id;
  if (nonce == null || id == null) {
    return next(new Error('Invalid Request null'));
  }

  User.findById(id, (err, user) => {
    if (err) {
      return next(new Error('Invalid Request err find'));
    }
    // checking for errors
    if (user.passwordResetTime == null) {
      return next(new Error('Invalid Request reset time'));
    }
    if (user.nonce == null) {
      return next(new Error('Invalid Request nonce null'));
    }

    // checking the nonce assigned to the user against the query nonce
    if (nonce != user.nonce) {
      return next(new Error('Invalid Request nonce match'));
    }

    // check to see 24 hr elapsed
    const now = new Date();

    // time in ms since reset
    const diff = (now - user.passwordResetTime) / 1000 / 60 / 60;

    if (diff > 24) {
      return next(new Error('Invalid Request token expired'));
    }

    // using this this data object means you can add more
    // items when you render
    const data = {
      user: user,
      nonce: nonce,
    };
    // valid request
    res.render('resetPassword', data);
  });
});

router.post('/newpassword', (req, res, next) => {
  // set new password
  const password = req.body.password;
  const passwordCheck = req.body.passwordCheck;
  const nonce = req.body.nonce;
  const id = req.body.id;

  if (id == null || password == null || passwordCheck == null || id == null) {
    console.log(id);
    console.log(password);
    console.log(nonce);
    console.log(passwordCheck);

    return next(new Error('Invalid request null'));
  }

  // check to see if passwords match
  if (password != passwordCheck) {
    return next(new Error('Passwords do not match'));
  }

  User.findById(id, (err, user) => {
    if (err) {
      return next(err);
    }
    // checking for errors
    if (user.passwordResetTime == null) {
      return next(new Error('Invalid Request rest time null'));
    }
    if (user.nonce == null) {
      return next(new Error('Invalid Request nonce null'));
    }

    // checking the nonce assigned to the user against the query nonce
    if (nonce != user.nonce) {
      return next(new Error('Invalid Request nonce match'));
    }

    // check to see 24 hr elapsed
    const now = new Date();

    // time in ms since reset
    const diff = (now - user.passwordResetTime) / 1000 / 60 / 60;

    if (diff > 24) {
      return next(new Error('Invalid Request token expired'));
    }

    // set new password

    user.password = bcryptjs.hashSync(password, 10);
    user.save();
    res.redirect('/');
  });
});

router.get('/logout', (req, res) => {
  // passport binds user to req.user
  req.logOut();
  res.redirect('/');
});

module.exports = router;
