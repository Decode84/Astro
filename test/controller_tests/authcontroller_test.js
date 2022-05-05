/* eslint-disable no-undef */
const request = require('supertest')
const assert = require('assert')
const express = require('express')
const expressEjsLayout = require('express-ejs-layouts')
const session = require('express-session')
const stSession = require('supertest-session')
const authController = require('../../src/app/Http/AuthenticationController.js')
const User = require('../../src/app/Models/User')
const flash = require('express-flash')
const cors = require('cors')
const path = require('path')

const app = express()

const sess = {
    secret: 'testSecret',
    saveUninitialized: false, // don't create session until something stored
    resave: false, // don't save session if unmodified
    // rolling: true, //Reset the cookie Max-Age on every request
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: false // true for https
    }
}

app.set('views', path.join(__dirname, '../../src/resources/views'))
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

app.use(session(sess))
app.use(flash())
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.use('/', express.static('public'), require('../../src/routes'))

const PORT = process.env.PRI_SERVER_PORT || process.env.SEC_SERVER_PORT
app.listen(PORT, (err) => {
    if (err) console.log(err)
})

let newUser
let testSession = null

beforeEach((done) => {
    // Create a test session
    testSession = stSession(app)

    // Create a test user
    newUser = new User({
        name: 'Test User',
        username: 'testuser',
        email: 'test@test.test',
        password: '$2b$10$R.i4.m0ApkV3Em7mzpgNC.w9W9dAoJlvLJa5YjREL108m5XLt2pIO',
        date: Date.now(),
        services: {},
        projectIDs: [],
        authentications: {}
    })
    newUser.save()
        .then(() => done())
})
/*
describe('Testing Authentication', () => {
    it('User verification', (done) => {
        testSession
            .get('/authenticate')
            .send({
                username: 'testuser',
                password: 'testPassword'
            })
            .set('Accept', 'text/html')
            .then(response => {
                console.log(response)
            })
    })
})
*/