const express = require('express');
const router = express.Router();

// ACCOUNT ROUTE IS CALLED UPON THE LOGIN ROUTE
router.get('/', (req, res) => {
    // passport binds user to req.user
    res.json({
        // || render this instead
        user:req.user || 'not logged in'
    })
});

router.get('/logout', (req, res) => {
    // passport binds user to req.user
    req.logOut();
    res.json({
        confirmation:'logged out',
    })
});

module.exports = router;