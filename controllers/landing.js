const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const { render } = require('ejs');



router.get('/', (req, res) => {
    res.render('landing');
})

router.post('/register', async function(req,res){
    try {
        const foundUser = await db.User.findOne({email: req.body.email});
        if (foundUser) {
            return res.send({message: 'Email is already in use'})
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);
        req.body.password = hash;
        const newUser = await db.User.create(req.body);
        res.redirect('/');
    } catch (err) {
        console.log(err)
    }
})

router.post('/login', async function(req, res){
    try {
        users = await db.User.find({});
        const foundUser = await db.User.findOne({username: req.body.username});
        if (!foundUser) {

            return res.send({message:'Password or email incorrect.'})
        }
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if (!match) {
            return res.send({message:'Password or email incorrect.'})
        }
        req.session.currentUser = {
            id: foundUser._id,
            username: foundUser.username,
        }
        res.redirect('/home')

    } catch(err) {
        res.send({message: 'Internal Server Error'})
    }
})

router.delete('/logout', async function(req, res){
    await req.session.destroy();
    res.redirect('/')
})


module.exports = router;
