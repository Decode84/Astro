const User = require('../Models/User')
const bcrypt = require('bcrypt')
const randtoken = require('rand-token')
const mailCon = require('./MailController')

class AuthenticationController {
    /**
     * Show the login page and check if the user is already logged in
     * @param {*} req
     * @param {*} res
     */
    async showLogin(req, res) {
        if (req.session.user) {
            res.redirect('/projects')
        } else {
            res.render('auth/login', { message: req.flash('loginMessage') })
        }
    };

    /**
     * Show the register page and check if the user is already logged in
     * @param {*} req
     * @param {*} res
     */
    async showRegister(req, res) {
        if (req.session.user) {
            res.redirect('/projects')
        } else {
            res.render('auth/register', { message: req.flash('registerMessage') })
        }
    };

    /**
     * Show the forgot password page and check if the user is already logged in
     * @param {*} req
     * @param {*} res
     */
    async showForgot(req, res) {
        if (req.session.user) {
            res.redirect('/projects')
        } else {
            res.render('auth/forgot', { message: req.flash('forgotMessage') })
        }
    };

    /**
     * Show the reset page if user wants to reset password
     * @param {*} req
     * @param {*} res
     */
    async showReset(req, res) {
        if (req.session.user) {
            res.redirect('/projects')
        } else {
            res.render('auth/reset', {
                token: req.query.token,
                message: req.flash('resetMessage')
            })
        }
    };

    /**
     * Authenticate the user and redirect to the dashboard
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async authenticate(req, res) {
        const { username, password } = req.body

        User.findOne({ username }).then((user) => {
            if (!user) {
                req.flash('loginMessage', 'User does not exists')
                res.redirect('/login')
                return
            }

            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    req.session.regenerate(() => {
                        req.session.user = user
                        res.redirect('/projects')
                    })
                } else {
                    req.flash('loginMessage', 'Incorrect password')
                    res.redirect('/login')
                }
            })
        }).catch((err) => console.log(err))
    };

    /**
     * Create a new user and redirect to the dashboard
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async signup(req, res) {
        const { name, username, email, password, passwordConfirmation } = req.body

        User.findOne({ username }).then((user) => {
            if (user) {
                req.flash('registerMessage', 'User allready exists')
                res.redirect('/register')
                return
            }
            const newUser = new User({ name, username, email, password })

            bcrypt.hash(newUser.password, 10, function (err, hash) {
                if (err) console.log(err)
                newUser.password = hash
                newUser.save().then((user) => {
                    req.session.user = user
                    res.redirect('/projects')
                })
            })
        }).catch((err) => console.log(err))
    };

    /**
     * Logout the user and redirect to the login page
     * @param {*} req
     * @param {*} res
     */
    async logout(req, res) {
        if (req.session) {
            req.session.destroy(() => {
                res.redirect('/login')
            })
        } else {
            res.redirect('/login')
        }
    };

    /**
     * Used to send mail with token to reset user password
     * @param {*} req
     * @param {*} res
     * @returns
     */

    async resetPass(req, res) {
        const { email } = req.body

        User.findOne({ email }).then((user) => {
            if (!user) {
                req.flash('forgotMessage', 'No user with this email exists')
                res.redirect('/forgot')
                return
            }

            const token = randtoken.generate(20)
            const sent = mailCon.sendEmail(email, token)

            if (sent !== '0') {
                user.token = token
                user.save().then(() => {
                    req.flash('forgotMessage', 'Email sent')
                    res.redirect('/forgot')
                })
            }
        }).catch((err) => console.log(err))
    };

    /**
     * Used to send mail with token to reset user password
     * @param {*} req
     * @param {*} res
     * @returns
     */

    async updatePass(req, res) {
        const { token, password } = req.body

        User.findOne({ token }).then((user) => {
            if (!user) {
                req.flash('forgotMessage', 'Token invalid')
                res.redirect('/forgot')
                return
            }

            bcrypt.hash(password, 10, function (err, hash) {
                if (err) console.log(err)
                user.password = hash
                user.token = undefined
                user.save().then((user) => {
                    req.session.user = user
                    res.redirect('/projects')
                })
            })
        }).catch((err) => console.log(err))
    };
}

module.exports = new AuthenticationController()
