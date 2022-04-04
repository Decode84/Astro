const mongo = require('mongoose');

const Schema = mongo.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
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
    HashedPassword: String,
    email: String,
    projects: [
    ],
});

const User = mongo.model("User", UserSchema);
module.exports = User;
