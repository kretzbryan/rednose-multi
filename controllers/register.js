const express = require('express');
const mongo = require('mongodb')
const router = express.Router();
const db = require('../models');
const mongoose= require('mongoose')
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../emails/account')
const { check, validationResult } = require('express-validator')




// Creates new user and redefines the password with a hash
router.post('/', [
    check('firstName', 'First Name is required').not().isEmpty(),
    check('lastName', 'Last Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('password1', 'Please enter a password with 6 or more characters.').isLength({ min: 6 }),
    check('password2', 'Passwords do not match').matches('password1'),
], async function(req,res){
    const errors = validationResult(req)
    console.log(req.body)
    if(!errors.isEmpty()) {
        res.render('landing', {registerErrors: errors.errors, currentUser: null, loginError: null})
    }
    // try {
    //     const foundUser = await db.User.findOne({email: req.body.email});
    //     if (foundUser) {
    //         return res.send({message: 'Email is already in use'})
    //     }
    //     const salt = await bcrypt.genSalt(10);
    //     const hash = await bcrypt.hash(req.body.password, salt);
    //     req.body.password = hash;
    //     const newUser = await db.User.create(req.body);
    //     // sendWelcomeEmail(newUser.email, newUser.firstName);
    //     res.redirect('/');
    // } catch (err) {
    //     console.log(err)
    // }
})

module.exports = router;