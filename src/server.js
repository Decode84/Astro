const express = require('express')
const app = express()
const path = require('path')
const expressEjsLayout = require('express-ejs-layouts')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const sessions = require('express-session')

// Template Engine
app.set('views', path.join(__dirname, '../src/resources/views'))
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

// Register session cookies
app.use(sessions({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    cookie: { maxAge: 108000 }, // 30 hours add ", Secure: True" and next to maxAge and app.set('trust proxy', 1)  for https
    resave: false
}))

// create req.body method
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Public assets
app.use(express.static(path.join(__dirname, '../public')))

// Routes path
app.use('/', express.static('public'), require('./routes/web'))

// Database
require('./database/mongo')

// Server app
const PORT = process.env.PRI_SERVER_PORT || process.env.SEC_SERVER_PORT
app.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log(`Homepage hosted here: http://localhost:${PORT}/`)
})
