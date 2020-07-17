const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/:id', async (req, res) => {
    try {
        const foundProfile = await db.User.findById(req.params.id).populate('posts').populate('gigs');
        const currentUser = await db.User.findById(req.session.currentUser.id)
        res.render('profile', {currentUser: currentUser, profile: foundProfile})
    } catch(err) {
        console.log(err)
}
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedUser = await db.User.findByIdAndDelete(req.params.id);
        const deletedPosts = await db.Post.remove({ author: deletedUser._id });
        const deletedGigs = await db.Gig.remove({ author: deletedUser._id });
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }

})

module.exports = router;