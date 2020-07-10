const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const controllers = require('./controllers');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const db = require('./models');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + './public'));
app.set('view engine', 'ejs');


// Session Configuration
app.use(
    session({
    store: new MongoStore({
        url: 'mongodb://localhost:27017/circusnetwork'
    }),
    secret: 'super cyute doggo',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 3 // 3 hours
    }
}))

app.use('/landing', controllers.landing);
app.use('/home', controllers.home);
app.use('/profile', controllers.profile);
app.use('/faq', controllers.faq);
app.use('/browse-profiles', controllers.profileBrowse);

app.listen( PORT, () => {
    console.log(`Now on port ${PORT}`)
})