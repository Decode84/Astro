const router = require('express').Router()
const auth = require('../app/Http/AuthenticationController')
const admin = require('../app/Http/Admin/AdminController')
const middleware = require('../app/Middleware/Authorization')
const discord = require('../app/Http/DiscordController')

/**
 * This web file is the router used to describe the correspondence
 * between the URL and the controller that will perform the action.
 */

// Authentication
router.get('/login', auth.showLogin)
router.get('/register', auth.showRegister)
router.get('/forgot', auth.showForgot)
router.post('/authenticate', auth.authenticate)
router.post('/signup', auth.signup)
router.post('/logout', middleware.authLogin, auth.logout)
router.get('/discord', discord.discordAuth)
router.post('/discord', discord.discordAuth)

// Admin (TODO: check for role)
router.get('/admin/board', middleware.authLogin, admin.showBoard)

module.exports = router
