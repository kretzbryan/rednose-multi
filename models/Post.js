const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    content: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Post', postSchema);