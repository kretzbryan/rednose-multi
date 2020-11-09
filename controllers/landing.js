const express = require('express');
const mongo = require('mongodb')
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose= require('mongoose');
const config = require('config');

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
                res.render('landing', {currentUser: foundUser});
            }
        })
    } else {
        res.render('landing', {currentUser: null})
    }
})



// Creates a json list of uploaded files
router.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        if(!files) {
            res.render('landing', {files: false})
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


// logs out user
router.delete('/logout', async function(req, res){
    await req.session.destroy();
    res.redirect('/')
})


module.exports = router;
