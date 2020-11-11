const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const postSchema = new Schema({
    text: {type: String, required: true},
    name: {type: String, required: true},
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    likes: [{
       user: {
           type: Schema.Types.ObjectId,
           ref: 'User'
       }
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', postSchema);