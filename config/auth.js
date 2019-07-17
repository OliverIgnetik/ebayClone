const passportLocal = require('passport-local').Strategy;
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
                if (user.password != req.body.password) {
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
            // checks
            console.log(email);
            console.log(password);
            
            // LOCAL STRATEGY
            User.findOne({
                email: email
            }, (err, user) => {
                console.log(user);
                // Check for errors and pass to handler
                if (err) {
                    return next(err);
                }
                // already have an account
                if (user != null) {
                    return next(new Error('You already have an account, please login'));
                }

                User.create({email:email, password:password}, (err, user) => {
                    if (err)
                        return next(err)
    
                    next(null, user)
                })
            });
        });

    passport.use('localRegister', localRegister);
}