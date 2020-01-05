const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect('/playlist');
    }
    else {
        res.render('welcome');
    }
});

router.get('/playlist', ensureAuthenticated, (req, res) => {
    res.render('playlist', { name: req.user.name });
});

module.exports = router;