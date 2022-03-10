const User = require('../Models/User');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    res.render('auth/login');
}

exports.register = (req, res) => {
    res.render('auth/register');
}

exports.authenticate = (req, res) => {

}

exports.store = (req, res) => {
    
}

exports.logout = (req, res) => {

}