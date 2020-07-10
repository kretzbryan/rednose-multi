const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const controllers = require('./controllers');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const db = require('./models');


app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + './public'));
app.set('view engine', 'ejs');

app.use('/landing', controllers.landing);
app.use('/home', controllers.home);
app.use('/profile', controllers.profile);
app.use('/faq', controllers.faq);
app.use('/browse-profiles', controllers.profileBrowse);

app.listen( PORT, () => {
    console.log(`Now on port ${PORT}`)
})