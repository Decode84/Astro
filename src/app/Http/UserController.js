const User = require("../Models/User");
const bcrypt = require("bcrypt");

function index(req, res) {
    res.render('users/index');
}

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

async function getUser(userName) {
    // Find the user in the database

    const userData = await User.findOne({ name: userName }).exec();


    return userData;
}


module.exports = {
    index,
    newUser,
    getUser,
};
