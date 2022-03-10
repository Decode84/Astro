const mongo = require('mongoose');

const Schema = mongo.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const User = mongo.model('User', UserSchema);
module.exports = User;