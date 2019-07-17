const express = require('express');
const router = express.Router();
const items = [
    {name:'Item 1',description:'',price:10},
    {name:'Item 2',description:'',price:10},
    {name:'Item 3',description:'',price:10},
    {name:'Item 4',description:'',price:10},
    {name:'Item 5',description:'',price:10},
];

// ACCOUNT ROUTE IS CALLED UPON THE LOGIN ROUTE
// during the passport call
router.get('/', (req, res) => {
    // passport binds user to req.user
    const user = req.user;
    
    // just incase there is no user
    if (user==null){
        res.redirect('/');
        return;
    }

    // set the user as data to pass to account ejs template
    // reference object multiple times
    const data = {
        user:user,
        items:items
    }

    // Pass render a user object
    res.render('account',data);
});

router.get('/logout', (req, res) => {
    // passport binds user to req.user
    req.logOut();
    res.json({
        confirmation:'logged out',
    })
});

module.exports = router;