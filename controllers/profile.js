const express = require('express');
const router = express.Router();
const db = require('../models');
const { sendCancelEmail } = require('../emails/account');
const time = require('time-since');

router.get('/:id', async (req, res) => {
	try {
		const foundProfile = await db.User.findById(req.params.id)
			.populate('gigs')
			.populate('posts');
		const profilePosts = await db.Post.aggregate([
			{ $match: { user: foundProfile._id } },
			// {
			//     $unwind:
			//     {
			//         path: '$comments',
			//         includeArrayIndex: 'comment',
			//         preserveNullAndEmptyArrays: true
			//     }
			// },
			{
				$lookup: {
					from: 'comments',
					localField: 'comments',
					foreignField: '_id',
					as: 'comments',
				},
			},
			{
				$unwind: {
					path: '$comments',
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$lookup: {
					from: 'users',
					localField: 'comments.user',
					foreignField: '_id',
					as: 'comments.user',
				},
			},
			{
				$group: {
					_id: '$_id',
					comments: { $push: '$comments' },
					name: { $first: '$name' },
					user: { $first: '$user' },
					text: { $first: '$text' },
					createdAt: { $first: '$createdAt' },
				},
			},
		]);

		const postComments = profilePosts;
		console.log('post comments', postComments);
		const currentUser = await db.User.findById(req.session.currentUser.id);
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
		res.render('profile', {
			currentUser: currentUser,
			profilePosts: profilePosts,
			profile: foundProfile,
			time: time,
			gigs: recentGigs,
		});
	} catch (err) {
		console.log(err);
	}
});

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
});

module.exports = router;
