const express = require('express');
const router = express.Router();
const db = require('../models');
const time = require('time-since');

// Shows all profiles with the exception of the current User
router.get('/', async (req, res) => {
	try {
		const foundUsers = await db.User.find();
		const foundUser = await db.User.findById(req.session.currentUser.id);
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
		res.render('profile-browse', {
			users: foundUsers,
			currentUser: foundUser,
			gigs: recentGigs,
			time: time,
		});
	} catch (err) {}
});

module.exports = router;
