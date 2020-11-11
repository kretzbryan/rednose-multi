const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(process.env.MONGODB_URI || config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => {
    console.log('MongoDB Connected!');
})
.catch(err => {
    console.log(err);
})

module.exports = {
    Gig: require('./Gig'),
    Post: require('./Post'),
    User: require('./User'),
}