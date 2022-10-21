const express = require('express');
const router = express.Router();
const Grid = require('gridfs-stream');
const db = require('../models');
const upload = require('../middleware/upload');
const mongoose = require('mongoose');
const config = require('config');
const time = require('time-since');

const conn = mongoose.createConnection(
	process.env.MONGODB_URI || config.mongoURI
);

let gfs;

conn.once('open', () => {
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('profileImages');
});

// User Home Page
router.get('/', async (req, res) => {
	if (req.session.currentUser) {
		try {
			const currentUser = await db.User.findById(req.session.currentUser.id);
			const allPosts = await db.Post.find({})
				.populate('user')
				.populate({
					path: 'comments',
					populate: {
						path: 'user',
						model: 'User',
					},
				});
			const allGigs = await db.Gig.find({}).populate('user');
			const recentGigs = await db.Gig.aggregate([
				{ $sort: { createdAt: -1 } },
				{ $limit: 5 },
				{
					$lookup: {
						from: 'users',
						localField: 'user',
						foreignField: '_id',
						as: 'user_doc',
					},
				},
			]);
			console.log(recentGigs.length);
			res.render('home', {
				currentUser: currentUser,
				posts: allPosts,
				gigs: recentGigs,
				time: time,
			});
		} catch (err) {
			console.log(err);
		}
	} else {
		res.redirect('/');
	}
});

// Creates gig with author Id, adds gig id to user.Gigs
router.post('/add-gig', (req, res) => {
	db.Gig.create(req.body, (err, addedGig) => {
		if (err) {
			console.log(err);
		} else {
			db.User.findById(req.session.currentUser.id, (err, foundUser) => {
				if (err) {
					console.log(err);
				} else {
					foundUser.gigs.push(addedGig.id);
					foundUser.save();
					res.redirect('/home');
				}
			});
		}
	});
});

router.put('/edit-profile/:id', (req, res) => {
	db.User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedUser) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/home');
			}
		}
	);
});

router.put('/edit-gig/:id', (req, res) => {
	db.Gig.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedGig) => {
			if (err) {
				console.log(err);
			} else {
				res.redirect('/home');
			}
		}
	);
});

// Uploads profile image to Grid-Fs storage in mongodb
router.put('/upload-profile-image', async function (req, res) {
	console.log('req.body before hits upload middleware', req.file);
	try {
		await upload(req, res);
		const updatedUser = await db.User.findByIdAndUpdate(
			req.session.currentUser.id,
			{
				profileImage: {
					filename: req.file.filename,
					mimetype: req.file.mimetype,
				},
			}
		);
		if (req.file === undefined) {
			return res.send('Select a file');
		}
		res.redirect('/home');
	} catch (err) {
		console.log(err);
		return res.send('Error when uploading.');
	}
});

// Delete Gig
router.delete('/delete-gig/:id', (req, res) => {
	db.Gig.findByIdAndDelete(req.params.id, (err, deletedGig) => {
		if (err) {
			console.log(err);
		} else {
			db.User.findById(deletedGig.author, (err, foundUser) => {
				if (err) {
					console.log(err);
				} else {
					foundUser.gigs.remove(deletedGig);
					foundUser.save();
					res.redirect('/home');
				}
			});
		}
	});
});

module.exports = router;
