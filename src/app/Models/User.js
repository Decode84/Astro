const mongo = require('mongoose')
const Schema = mongo.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        unique: true,
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        expires: '10m'
    },
    date: {
        type: Date,
        default: Date.now
    },
    services: Schema.Types.Mixed,
    projectIDs: [
        String
    ],
    authentications: Schema.Types.Mixed
}, { strict: false })

module.exports = mongo.model('User', UserSchema)
