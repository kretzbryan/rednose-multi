const db = require('../models');
const express = require('express');
const router = express.Router();


// Creates a post with author id, adds post id to User.posts
router.post('/',  async (req, res) => {
    console.log(req.body)

    try {
        const user = await db.User.findById(req.session.currentUser.id)
        const post = new db.Post({
            text: req.body.text,
            name: `${user.firstName} ${user.lastName}`,
            user: user._id
        });
        await post.save();
        await user.posts.push(post);
        await user.save();
        res.redirect('/home')
    } catch (err) {
        console.log(err)
    }

    /* db.Post.create(req.body, (err, addedPost) => {
        if (err) {
            console.log(err);
        } else {
            db.User.findById(req.session.currentUser.id, (err, foundUser) => {
                if(err) {
                    console.log(err);
                } else {
                    foundUser.posts.push(addedPost.id);
                    foundUser.save();
                    res.redirect('/home')
                }
            })
        }
    }) */
})

router.put('/:id', (req, res) => {
    db.Post.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedPost) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/home');
        }
    })
})


// Adds comment to post
router.post('/comment/:id', async (req, res) => {
    try {
        const user = await db.User.findById(req.session.currentUser.id).select('-password');
        const post = await db.Post.findById(req.params.id);
        const comment = new db.Comment({
            post: post._id,
            text: req.body.text,
            name: `${user.firstName} ${user.lastName}`,
            user: user._id 
        })
        await comment.save();
        await post.comments.push(comment);
        await post.save();
        res.redirect('/home')
    } catch (err) {
        console.log(err)
    }
}) 

// Edits comment on post
router.put('/comment/:id', async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id);
        
        await post.comments.push(comment);
        await post.save();
        res.redirect('/home')
    } catch (err) {
        console.log(err)
    }
}) 

// Removes comment and comment objectId from post
router.delete('/comment/:id', async (req, res) => {
    try {
        const comment = await db.Comment.findById(req.params.id);
        const post = await db.Post.findById(comment.post);
        await post.comments.remove(comment);
        await post.save();
        await comment.remove();
        res.redirect('/home')
    } catch (err) {
        console.log(err);
    }
})

// Remove post and all comments associated with it.
router.delete('/:id', async (req, res) => {

    try {
        const post = await db.Post.findById(req.params.id);
        const user = await db.User.findById(req.session.currentUser.id);
        await post.comments.forEach(async comment => {
            await db.Comment.findByIdAndDelete(comment._id);
        })
        await user.posts.remove(post);
        await user.save();
        await post.remove();
        res.redirect('/home')
    } catch (err) {
        console.log(err)
    }
})



module.exports = router;