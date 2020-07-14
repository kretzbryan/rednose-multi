const mongoose = require('mongoose')

const gigSchema = new mongoose.Schema({
    title: {type: String, required: true},
    location: {type: String, required: true},
    description: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    } 
})

module.exports = mongoose.model('Gig', gigSchema);