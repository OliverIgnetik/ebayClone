// modules
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// set up mongoose
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
// auth is a function so you have to pass it an arguement
// you wont use this again
const auth = require('./config/auth')(passport);
const bcryptjs = require('bcryptjs');

// ROUTES
const home = require('./routes/home.js');
const register = require('./routes/register.js');
const login = require('./routes/login');
const account = require('./routes/account');
const admin = require('./routes/admin');

// set up mongoose connection
mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose
  .connect('mongodb://localhost:27017/sample-store', {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDB Connection Succeeded.'))
  .catch(err => console.log('Error in DB connection: ' + err));

// use express for app
const app = express();

// set the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// middleware for post requests
app.use(bodyParser.urlencoded({ extended: true }));

// find the static assets
app.use(express.static(path.join(__dirname, 'public')));

// session set up
app.use(
  session({
    // everyone must relog if this is changed
    // hash secret key
    secret: bcryptjs.hashSync(process.env.SECRET + '', 10),
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// connect routes
app.use('/', home);
app.use('/register', register);
app.use('/login', login);
app.use('/account', account);
app.use('/admin', admin);

// error handling
app.use((err, req, res, next) => {
  // render is expecting an error object
  res.render('error', { message: err.message });
});

// listen for app
app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
