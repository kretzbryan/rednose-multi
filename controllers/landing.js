const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const { render } = require('ejs');



router.get('/', (req, res) => {
    res.render('landing');
})

router.post('/register', async function(rec,res){
    try {
        const foundUser = await db.User.findOne({email: req.body.email});
        if (foundUser) {
            return res.send({message: 'Email is already in use'})
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        const newUser = await db.User.create({username: req.body.username, email: req.body.email, password: req.body.password});
        const newProfile = await db.Profile.create({firstName: req.body.firstName, lastName: req.body.lastName, user: newUser._id});
        res.redirect('/');
    } catch (err) {
        res.send('internal server error')
    }
})

router.post('/login', async function(req, res){
    try {

    } catch(err) {
        res.send({message: 'Internal Server Error'})
    }
})


module.exports = router;
