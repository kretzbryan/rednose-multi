const express = require('express');
// const { patch } = require('./landing');
// const { render } = require('ejs');
const router = express.Router();
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const db = require('../models');


const mongoURI = 'mongodb://localhost:27017/circusnetwork';


router.get('/', (req, res) => {
    db.User.find({}, (err, allProfiles) => {
        if(err) {
            console.log(err)
        }
        else {
            db.User.findById(req.session.currentUser.id, (err, foundUser) => {
                if(err) {
                    console.log(err)
                } else {
                    res.render('home', {profiles: allProfiles, user: foundUser});
                }
            })
        }
    })
})

module.exports = router;