const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // passport binds user to req.user
    res.json({
        // || render this instead
        user:req.user || 'not logged in'
    })
});

module.exports = router;