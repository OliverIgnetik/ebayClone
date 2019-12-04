const express = require('express');
const passport = require('passport');
const router = express.Router();

// get the login page
router.get('/', (req, res, next) => {
  // render the login file
  res.render('login', null);
});

router.post(
  '/',
  passport.authenticate('localLogin', {
    // use passport strategy to redirect after check
    successRedirect: '/account',
  }),
);

module.exports = router;
