// modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// set up mongoose
const mongoose = require('mongoose');
// ROUTES
const home  = require('./routes/home.js');
const register  = require('./routes/register.js');
const login = require('./routes/login');

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/sample-store', {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

// use express for app
const app = express();

// set the view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'hjs');

// middleware for post requests
app.use(bodyParser.urlencoded({extended: true}));

// find the static assets
app.use(express.static(path.join(__dirname,'public')));

// set up routes
app.use('/',home);
app.use('/register',register);
app.use('/login',login);
// error handling
app.use((err,req,res,next)=>{
    // error has to be an object
    res.render('error',{message:err.message});
})


// listen for app
app.listen(3000, () => {
    console.log('App listening on port 3000!');
});
