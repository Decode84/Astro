const express = require('express');
const app = express();
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
const sessions = require("express-session");
const dotenv = require('dotenv');

//read .env
dotenv.config();

// Template Engine
app.set('views', path.join(__dirname, '../src/resources/views'));
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

// Public assets
app.use(express.static(path.join(__dirname, '../public')));

// Routes path
app.use('/api/', require('./routes/home'));
app.use('/api/users', require('./routes/user'));
app.use('/api/auth', require('./routes/auth'));

// Database
require('./database/mongo');
// create req.body method
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Register session cookies
app.use(sessions({
    secret: process.env.SECRET_KEY,
    saveUninitialized:true,
    cookie: { maxAge: 108000 }, //30 hours add ", Secure: True" and next to maxAge and app.set('trust proxy', 1)  for https
    resave: false,
    rolling: true //Add store: if instead of saving cookie sessions in memory save to the database instead
}));

// Server app
app.listen(process.env.SERVER_PORT || 3000, (err) => {
    console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`);
    if (err) {
        console.log(err);
    }
});
