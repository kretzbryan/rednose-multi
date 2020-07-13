const express = require('express');
// const { patch } = require('./landing');
const { render } = require('ejs');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const db = require('../models');
const upload = require('../middleware/upload');
const mongo = require('mongodb')
const mongoose = require('mongoose');


const mongoURI = 'mongodb://localhost:27017/circusnetwork';
const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('profileImages');
})

router.get('/', (req, res) => {
    if (req.session.currentUser) {
        db.User.find({}, (err, allUsers) => {
            if(err) {
                console.log(err)
            }
            else {
                db.User.findById(req.session.currentUser.id, (err, foundUser) => {
                    if(err) {
                        console.log(err)
                    } else {
                        res.render('home', {profiles: allUsers, user: foundUser});
                    }
                })
            }
        })
    } else {
        res.redirect('/')
    }
})

router.put('/add', async function(req, res) {

    try {
        await upload(req, res);
        const updatedUser = await db.User.findByIdAndUpdate(req.session.currentUser.id, {
            profileImage: {
                filename: req.file.filename,
                mimetype: req.file.mimetype
            }
        }) 
        console.log(updatedUser);
        if (req.file === undefined) {
            return res.send('Select a file');
        }
        res.redirect('/home')
    } catch (err) {
        console.log(err);
        return res.send('Error when uploading.')
    }
})

// router.post('/add', (req, res) => {
//     console.log(req.file)
    // db.User.findByIdAndUpdate(req.session.currentUser.id, req.body, {new:true}, (err, updatedUser) => {
    //     if(err) {
    //         console.log(err)
    //     } else {
    //         console.log(req.body);
    //         res.redirect('/');
    //     }
    // })
// })

module.exports = router;