const User = require('../Models/User')
const bcrypt = require('bcrypt')

function index(req, res) {
    res.render('users/index');
}

// ! Deprecated. The user is registered by the authentication controller.
async function newUser(userName, email, hashedPassword) {

    // Check if the user already exists.
    const userData = await getUser(userName);
    if (userData !== null) {
        throw new Error('User already exists.');
    }

    // Create a new user
    const user = new User({ name: userName, email: email, hashedPassword: hashedPassword });
    // Save the user to the database
    await user.save();

}

async function getUser(UserID) {
    // Find the user in the database

    const userData = await User.findById(UserID).exec();


    return userData;
}

async function getUserID(userName) {
    // Find the user in the database

    const userData = await User.findOne({ name: userName }).exec();

    return userData._id;
}


module.exports = {
    index,
    newUser,
    getUser,
};
