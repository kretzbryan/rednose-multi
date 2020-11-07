const express = require('express');
const mongo = require('mongodb')
const router = express.Router();
const db = require('../models');
const mongoose= require('mongoose')
const bcrypt = require('bcryptjs');




// Creates new user and redefines the password with a hash
router.post('/', async function(req,res){
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

module.exports = router;