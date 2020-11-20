const express = require('express');
const router = express.Router();
const db = require('../models');
const { sendCancelEmail } = require('../emails/account')
const time = require('time-since')

router.get('/:id', async (req, res) => {
    try {
        const foundProfile = await (await db.User.findById(req.params.id).populate('gigs')).populated('posts');
        const currentUser = await db.User.findById(req.session.currentUser.id);
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
        await db.Post.populate()
        res.render('profile', {currentUser: currentUser, profile: foundProfile, time: time, gigs: recentGigs})
    } catch(err) {
        console.log(err)
}
})

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await db.User.findByIdAndDelete(req.params.id);
        const deletedPosts = await db.Post.remove({ author: deletedUser._id });
        const deletedGigs = await db.Gig.remove({ author: deletedUser._id });
        sendCancelEmail(deletedUser.email, deletedUser.firstName);
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }

})

module.exports = router;