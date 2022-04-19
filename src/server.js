const express = require('express')
const app = express()
const path = require('path')
const expressEjsLayout = require('express-ejs-layouts')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const sessions = require('express-session')
const mongoStore = require('connect-mongo')
const db = require('./database/mongo')
const helmet = require('helmet')

// Template Engine
app.set('views', path.join(__dirname, '../src/resources/views'))
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

// Database
require('./database/mongo')

// Register session cookies
app.use(sessions({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false, // don't create session until something stored
    resave: false, // don't save session if unmodified
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: false // true for https
    },
    store: mongoStore.create({
        mongoUrl: db._connectionString,
        ttl: 14 * 24 * 60 * 60, // = 14 days. Default
        autoRemove: 'native' // Default
        // crypto: {
        //    secret: 'process.ENV.SECRET_KEY',
        //    hashing: 'sha256'
        // }
    })
}))

// Security
app.use(helmet())

// create req.body method
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes path
app.use('/', express.static('public'), require('./routes/web'))

// Server app
const PORT = process.env.PRI_SERVER_PORT || process.env.SEC_SERVER_PORT
app.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log(`Homepage hosted here: http://localhost:${PORT}/`)
})

// Run Discord bot
require('./discord/DiscordBot')
