const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');
const Grid = require('gridfs-stream');
const mongoose= require('mongoose');
const config = require('config')

const conn = mongoose.createConnection(process.env.MONGODB_URI || config.mongoURI);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('profileImages');
})

// creates a show route based on file name to for reference later
router.get('/:filename', (req, res) => {
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

module.exports = router;