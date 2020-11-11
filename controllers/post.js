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

router.post('/comment/:id', async (req, res) => {
    try {
        const user = await db.User.findById(req.session.currentUser.id).select('-password');
        const post = await db.Post.findById(req.params.id);
        const comment = new db.Comment({
            text: req.body.text,
            name: `${user.firstName} ${user.lastName}`,
            user: user._id 
        })
        await post.comments.push(comment);
        await post.save();
        res.redirect('/home')
    } catch (err) {
        console.log(err)
    }
}) 


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


router.delete('/:id', (req, res) => {
    db.Post.findByIdAndDelete(req.params.id, (err, deletedPost) => {
        if(err) {
            console.log(err)
        } else {
            db.User.findById(deletedPost.author, (err, foundUser) => {
                if(err) {
                    console.log(err);
                } else {
                    foundUser.posts.remove(deletedPost)
                    foundUser.save();
                    res.redirect('/home');
                }
            })
        }
    })
})



module.exports = router;