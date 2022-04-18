const mongo = require('mongoose');
const Schema = mongo.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        index: { unique: true },
        type: String,
        required: true
    },
    email: {
        index: { unique: true },
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    discord: {
        type: String
    },
    HashedPassword: String,
    projectIDs: [
    ],
    authentications: Schema.Types.Mixed,
}, { strict: false });

module.exports = mongo.model("User", UserSchema);
