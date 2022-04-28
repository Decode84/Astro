const express = require('express')
const app = express()
const path = require('path')
const expressEjsLayout = require('express-ejs-layouts')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const sessions = require('express-session')
const flash = require('express-flash')
const mongoStore = require('connect-mongo')
const db = require('./database/mongo')
const cors = require('cors')

// Template Engine
app.set('views', path.join(__dirname, '../src/resources/views'))
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

// Database
require('./database/mongo')

// Register session cookies
const sessionManager = sessions({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false, // don't create session until something stored
    resave: false, // don't save session if unmodified
    // rolling: true, //Reset the cookie Max-Age on every request
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
})
app.use(sessionManager)

app.use(flash())

app.use(cors())

// create req.body method
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes path
app.use('/', express.static('public'), require('./routes'))

// Server app
const PORT = process.env.PRI_SERVER_PORT || process.env.SEC_SERVER_PORT
const server = app.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log(`Homepage hosted here: http://localhost:${PORT}/`)
})

// Run Discord Bot and WebSocket
let discordBot
if (process.env.DISCORD_BOT_TOKEN)
{
    discordBot = require('./discord/DiscordBot').StartBot()
    require('./app/WebSocket/DiscordChatSocket').StartDiscordWebSocket(server, sessionManager, discordBot)
}
else console.log('Couldn\'t find Discord token. Disabling Discord bot')
