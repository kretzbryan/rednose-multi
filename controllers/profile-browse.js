const express = require('express');
const router = express.Router();
const db = require('../models');


router.get('/', (req, res) => {
    if(req.session.currentUser) {
        db.User.find({
            id: {
                $not: {
                    $eq: {
                        id: req.session.currentUser.id
                    }
                }
            }
        }, (err, foundUsers) => {
            if (err) {
                console.log(err)
            } else {
                db.User.findById(req.session.currentUser.id, (err, foundUser) => {
                    if(err) {
                        console.log(err)
                    } else {
                        res.render('profile-browse', {users: foundUsers, user: foundUser});
                    }
                })
            }
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router;