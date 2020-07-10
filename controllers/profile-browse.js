const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/', (req, res) => {
    db.User.find({
        id: {
            $not: req.session.currentUser.id
        }
    }, (err, foundUsers) => {
        if (err) {
            console.log(err)
        } else {
            res.render('profile-browse', {users: foundUsers});
        }
    })
})

module.exports = router;