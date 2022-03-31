const User = require('../Models/User');
const bcrypt = require('bcrypt');

exports.index = (req, res) => {
    res.render('users/index');
}

function newUser(userName, email, hashedPassword) {
    const user = new User( { name: userName, email: email, HashedPassword: hashedPassword } );
    user.save();
}
