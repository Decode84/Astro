const User = require('../Models/User');
const bcrypt = require('bcrypt');

exports.index = (req, res) => {
    res.render('users/index');
}