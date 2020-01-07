const express = require('express');
const fetch = require('node-fetch');

const User = require('../models/User');

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
    const playlist = [];
    res.render('playlist', { playlist });
});

router.post('/playlist', ensureAuthenticated, (req, res) => {
    const url = req.body.url;
    if(!url) {
        req.flash('error_msg', 'Please fill in the field');
        res.redirect('/playlist');      
    }

    const videoID = getVideoID(url);
    const APIURL = new URL('https://www.googleapis.com/youtube/v3/videos');
    const option = {
        part: 'snippet',
        key: 'AIzaSyAKol0ai1U9nSW4NEXHQ57vEz2sG926WNc',
        id: videoID,
        maxResults: 1
    }
    APIURL.search = new URLSearchParams(option).toString();
    
    fetch(APIURL)
        .then(res => res.json())
        .then(data => {
            if(data.items.length == 0) {
                req.flash('error_msg', 'Invalid Youtube URL');
                res.redirect('/playlist');      
            }
            else {
                User.findOne({email: req.user.email})
                    .then(user => {
                        user.item.push(videoID);
                        user.save();

                        req.flash('success_msg', `You added new Yotube video - ${url}`);
                        res.redirect('/playlist');
                    })
                    .catch(err => {
                        console.error(err);
                        res.redirect('/')
                    });
            }
        });
});

function getVideoID(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

module.exports = router;