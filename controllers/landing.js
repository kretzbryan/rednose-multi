const express = require('express');
const mongo = require('mongodb')
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const { render } = require('ejs');
const { replaceOne } = require('../models/Gig');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose= require('mongoose')

const mongoURI = 'mongodb://localhost:27017/circusnetwork';
const conn = mongoose.createConnection(mongoURI);

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
                res.render('landing', {user: foundUser});
            }
        })
    } else {
        res.render('landing', {user: null})
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

// creates a show route based on file name to for reference later
router.get('/images/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file) {
            res.status(404).json({message: 'image not found'})
        }
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res)
        }
    })
})


// Creates new user and redefines the password with a hash
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
