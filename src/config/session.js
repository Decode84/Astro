const db = require('../database/mongo')
const mongoStore = require('connect-mongo')
require('../database/mongo')

const sess = {
    secret: process.env.SECRET_KEY,
    saveUninitialized: false, // don't create session until something stored
    resave: true, // don't save session if unmodified
    // rolling: true, //Reset the cookie Max-Age on every request
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: true // true for https
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
}

module.exports = sess
