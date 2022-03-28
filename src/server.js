const express = require('express');
const app = express();
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');
require('dotenv').config();


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

// Server app
app.listen(process.env.SERVER_PORT || 3000, (err) => {
    console.log(`Server is running on port ${process.env.SERVER_PORT || 3000}`);
    if (err) {
        console.log(err);
    }
});
