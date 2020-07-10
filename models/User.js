const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    title: {type: String, required: false},
    photo: {type:String, required: false},
    location: {type: String, required: false},
    active: {type: Boolean, default: true},
    certifications: [{
        type: String,
        required: false
    }],
    insurance: {type:String, required: false},
    externalLinks:{ type: String, required: false },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    gigs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig'
    }]
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);