const express = require('express');
const mongo = require('mongodb');
const router = express.Router();
const db = require('../models');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('../emails/account');
const { check, validationResult } = require('express-validator');

// Creates new user and redefines the password with a hash
router.post(
	'/',
	[
		check('firstName', 'First Name is required').not().isEmpty(),
		check('lastName', 'Last Name is required').not().isEmpty(),
		check('username', 'Username is required').not().isEmpty(),
		check(
			'password',
			'Please enter a password with 6 or more characters.'
		).isLength({ min: 6 }),
	],
	async function (req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render('landing', {
				registerErrors: errors.errors,
				currentUser: null,
				loginError: null,
			});
		}
		try {
			const userByEmail = await db.User.findOne({ email: req.body.email });
			const userByUsername = await db.User.findOne({
				username: req.body.username,
			});
			const passwordError = { msg: 'Passwords do not match' };
			const userError = { msg: 'Email or Username is already in use.' };
			if (
				userByEmail ||
				(userByUsername && req.body.password === req.body.password2)
			) {
				return res.render('landing', {
					registerErrors: [userError],
					currentUser: null,
					loginError: null,
				});
			}
			if (
				!userByEmail &&
				!userByUsername &&
				req.body.password !== req.body.password2
			) {
				return res.render('landing', {
					registerErrors: [passwordError],
					currentUser: null,
					loginError: null,
				});
			}
			if (
				userByEmail ||
				(userByUsername && req.body.password !== req.body.password2)
			) {
				return res.render('landing', {
					registerErrors: [passwordError, userError],
					currentUser: null,
					loginError: null,
				});
			}
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(req.body.password, salt);
			req.body.password = hash;
			const newUser = await db.User.create(req.body);
			// sendWelcomeEmail(newUser.email, newUser.firstName);
			res.redirect('/');
		} catch (err) {
			console.log(err);
		}
	}
);

module.exports = router;
