const express = require('express');
const router = express.Router();
db = require('../models');

router.get('/', (req, res) => {
    if(req.session.currentUser) {
    db.User.findById(req.session.currentUser.id, (err, foundUser) => {
        if(err) {
            console.log(err)
        } else {
            res.render('profile', {user: foundUser});
        }
    })
} else {
    res.redirect('/')
}
})


module.exports = router;