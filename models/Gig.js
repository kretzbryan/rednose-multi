const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		location: { type: String, required: true },
		gigImage: {
			filename: { type: String, required: false },
			mimetype: { type: String, required: false },
			required: false,
		},
		description: { type: String, required: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Gig', gigSchema);
