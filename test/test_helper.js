/* eslint-disable no-undef */
const mongoose = require('mongoose')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

mongoose.Promise = global.Promise
const MONGODB_URI = `mongodb+srv://${process.env.CDB_USERNAME}:${process.env.CDB_PASSWORD}@cluster0.apnvx.mongodb.net/${process.env.CTDB_NAME}?retryWrites=true&w=majority`
mongoose.connect(MONGODB_URI)

mongoose.connection
    .once('open', () => console.log('Connected to MongoDB'))
    .on('error', error => console.warn('Warning', error))

beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
        mongoose.connection.collection.projects.drop(() => {
            done()
        })
    })
})
