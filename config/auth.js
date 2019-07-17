const passportLocal = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = (passport)=>{
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
        passwordField:'password',
        passReqToCallback:true},
        
    (req,email,password,next)=>{
        // LOCAL STRATEGY
        User.findOne({email:email}, (err,user)=>{
            // Check for errors and pass to handler
            if(err){
                return next(err);
            }
            // user not found
            if(user== null){
                return next(new Error('User not found'));         
            }
            // check password
            if(user.password!=req.body.password){
                return next(new Error('incorrect password'));
            }
            
            return next(null,user);
        })
    })

    // tell passport to use this strategy
    passport.use('localLogin',localLogin);
}
