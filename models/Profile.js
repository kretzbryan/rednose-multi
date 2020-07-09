const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    title: {type: String, required: true},
    photo: {type:String, required: false},
    location: {type: String, required: true},
    active: {type: Boolean, required: true},
    certifications: [{
        type: String,
        required: false
    }],
    insurance: {type:String, required: false},
    externalLinks:[{
        type: String,
        required: false
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    gigs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig'
    }]
})

module.exports = mongoose.model('Profile', profileSchema);