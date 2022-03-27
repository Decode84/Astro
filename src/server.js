const express = require('express');
const app = express();
const path = require('path');
const expressEjsLayout = require('express-ejs-layouts');

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
// require('./database/mongo');
require('./database/mongo');

// Server app
const PORT = 4000;
app.listen(PORT, console.log(`Server started on ${PORT}`));
