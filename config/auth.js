const passportLocal = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const User = require('../models/User');


module.exports = (passport) => {
    // default config
    // store user in the session
    passport.serializeUser((user, next) => {
        next(null, user)
    });

    passport.deserializeUser((id, next) => {
        User.findById(id, (err, user) => {
            next(err, user)
        });
    });

    // Make a new localLogin Strategy
    const localLogin = new passportLocal({
            // identify parameters
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },

        (req, email, password, next) => {
            // LOCAL STRATEGY
            User.findOne({
                email: email
            }, (err, user) => {
                // Check for errors and pass to handler
                if (err) {
                    return next(err);
                }
                // user not found
                if (user == null) {
                    return next(new Error('User not found'));
                }
                // check password
                if (bcryptjs.compareSync(password, user.password) == false) {
                    return next(new Error('incorrect password'));
                }
                return next(null, user);
            })
        })

    // tell passport to use this strategy
    passport.use('localLogin', localLogin);

    // REGISTER STRATEGY
    const localRegister = new passportLocal({
            // identify parameters
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        // email = req.email
        (req, email, password, next) => {

            // LOCAL STRATEGY
            User.findOne({
                email: email
            }, (err, user) => {
                // Check for errors and pass to handler
                if (err) {
                    return next(err);
                }
                // already have an account
                if (user != null) {
                    return next(new Error('You already have an account, please login'));
                }
                // create the user with hashed pw
                const hashedPw = bcryptjs.hashSync(password, 10);
                let isAdmin = false;
                if (email.indexOf('@zenva.com') != -1){
                    isAdmin = true;
                }
                User.create({
                    email: email,
                    password: hashedPw,
                    isAdmin:isAdmin
                }, (err, user) => {
                    if (err)
                        return next(err)

                    next(null, user)
                })
            });
        });

    passport.use('localRegister', localRegister);
}