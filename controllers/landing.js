const express = require('express');
const mongo = require('mongodb')
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose= require('mongoose');
const config = require('config');
const {check, validationResult} = require('express-validator');

const conn = mongoose.createConnection(process.env.MONGODB_URI || config.mongoURI);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('profileImages');
})



router.get('/', (req, res) => {
    if(req.session.currentUser) {
        db.User.findById(req.session.currentUser.id, (err, foundUser) => {
            if(err) {
                console.log(err)
            } else {
                res.render('landing', {registerErrors: null, currentUser: foundUser, loginError: null});
            }
        })
    } else {
        res.render('landing', {registerErrors: null, currentUser: null, loginError: null})
    }
})



// Creates a json list of uploaded files
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(!files) {
            res.json({files: false})
        }
        return res.json(files)
    })
})




// logs in user and creates cookie for logged user
router.post('/login', async function(req, res){
    try {
        users = await db.User.find({});
        const foundUser = await db.User.findOne({username: req.body.username});
        if (!foundUser) {
            const error = 'Password or email incorrect.';
            currentUser = null;
            console.log(error)
            return res.render('landing',{error})
        }
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if (!match) {
            const error = 'Password or email incorrect.';
            currentUser = null;
            console.log(error)
            return res.render('landing', {error})
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


// logs out user
router.delete('/logout', async function(req, res){
    await req.session.destroy();
    res.redirect('/')
})


module.exports = router;
