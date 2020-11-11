const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        require: true
    },
    text: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.Model('Comment', commentSchema);