const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/', (req, res) => {
    db.User.find({}, (err, foundUsers) => {
        if (err) {
            console.log(err);
        }
    })
    res.render('profile-browse');
})

module.exports = router;