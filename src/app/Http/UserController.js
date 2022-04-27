const User = require('../Models/User')
const bcrypt = require('bcrypt')

function index(req, res) {
    res.render('users/index')
}

async function getUser(UserID) {
    // Find the user in the database

    const userData = await User.findById(UserID).exec()
    return userData
}

async function getUserID(userName) {
    // Find the user in the database

    const userData = await User.findOne({ username: userName }).exec();

    return userData._id
}

module.exports = {
    index,
    getUser,
    getUserID
};
