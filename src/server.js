const cors = require('cors')
const path = require('path')
const express = require('express')
const flash = require('express-flash')
const session = require('express-session')
const expressEjsLayout = require('express-ejs-layouts')

require('dotenv').config({
    path: path.resolve(__dirname, '../.env')
})

// Requirements
const sess = require('./config/session')
require('./database/mongo')

// Initialize express
const app = express()

// Template Engine
app.set('views', path.join(__dirname, '../src/resources/views'))
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

app.use(session(sess))
app.use(flash())
app.use(cors())

// create req.body method
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// Routes path
app.use('/', express.static('public'), require('./routes'))

// Server app
const PORT = process.env.PRI_SERVER_PORT || process.env.SEC_SERVER_PORT
app.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log(`Homepage hosted here: http://localhost:${PORT}/`)
})

// Run Discord bot
require('./discord/DiscordBot')
