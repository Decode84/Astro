const User = require('../Models/User')
const bcrypt = require('bcrypt')

class AuthenticationController {
    /**
     * Show the login page and check if the user is already logged in
     * @param {*} req
     * @param {*} res
     */
    async showLogin (req, res) {
        if (req.session.user) {
            res.redirect('/projects')
        } else {
            res.render('auth/login')
        }
    };

    /**
     * Show the register page and check if the user is already logged in
     * @param {*} req
     * @param {*} res
     */
    async showRegister (req, res) {
        if (req.session.user) {
            res.redirect('/projects')
        } else {
            res.render('auth/register')
        }
    };

    /**
     * Show the forgot password page and check if the user is already logged in
     * @param {*} req
     * @param {*} res
     */
    async showForgot (req, res) {
        if (req.session.user) {
            res.redirect('/projects')
        } else {
            res.render('auth/forgot')
        }
    };

    /**
     * Authenticate the user and redirect to the dashboard
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async authenticate (req, res) {
        const { username, password } = req.body

        User.findOne({ username }).then((user) => {
            if (!user) return res.status(400).send('User does not exist')

            bcrypt.compare(password, user.password).then((isMatch) => {
                if (isMatch) {
                    req.session.regenerate(() => {
                        req.session.user = user
                        res.redirect('/projects')
                    })
                } else {
                    return res.status(400).send('Incorrect password')
                }
            }).catch((err) => console.log(err))
        })
    };

    /**
     * Create a new user and redirect to the dashboard
     * @param {*} req
     * @param {*} res
     * @returns
     */
    async signup (req, res) {
        const { name, username, email, password, passwordConfirmation } = req.body

        User.findOne({ username }).then((user) => {
            if (user) return res.status(400).send('User already exists')
            const newUser = new User({ name, username, email, password })

            bcrypt.hash(newUser.password, 10, function (err, hash) {
                if (err) console.log(err)
                newUser.password = hash
                newUser.save().then((user) => {
                    req.session.user = user
                    res.redirect('/projects')
                }).catch((err) => console.log(err))
            })
        })
    };

    /**
     * Logout the user and redirect to the login page
     * @param {*} req
     * @param {*} res
     */
    async logout (req, res) {
        if (req.session) {
            req.session.destroy(() => {
                res.redirect('/login')
            })
        } else {
            res.redirect('/login')
        }
    };
}

module.exports = new AuthenticationController()
