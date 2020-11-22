const { decodeBase64 } = require('bcryptjs');
const express = require('express');
const router = express.Router();
const db = require('../models');
const time = require('time-since')

router.get('/', async (req, res) => {
    try {
        const currentUser = await db.User.findById(req.session.currentUser.id);
        const gigs = await db.Gig.find({}).populate('user');
        res.render('gigs', { currentUser, gigs, time })
    } catch (err) {
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const currentUser = await db.User.findById(req.session.currentUser.id);
        const gig = await db.Gig.findById(req.params.id).populate('user');
        const recentGigs = await db.Gig.aggregate([
            { $sort: {createdAt: -1 } },
            { $limit: 5 },
            { $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user_doc'
            } }
        ]);
        res.render('gig-show', { gig, currentUser, gigs: recentGigs, time })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;