const mongoose = require('mongoose');
const connectionString = 'mongodb://localhost:27017/circusnetwork';

mongoose.connect(process.env.MONGODB_URI || connectionString, {
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
    User: require('./User')
}