const router = require('express').Router()
const auth = require('../app/Http/AuthenticationController')
const admin = require('../app/Http/Admin/AdminController')
const middleware = require('../app/Middleware/Authorization')
const dash = require('../app/Http/ProjectController')
const { authenticateValidation, registerValidation } = require('../app/Validation/AuthValidation')

/**
 * This web file is the router used to describe the correspondence
 * between the URL and the controller that will perform the action.
 */

// Authentication
router.get('/login', auth.showLogin)
router.get('/register', auth.showRegister)
router.get('/forgot', auth.showForgot)
router.get('/reset', auth.showReset)
router.post('/authenticate', authenticateValidation, auth.authenticate)
router.post('/signup', registerValidation, auth.signup)
router.post('/logout', middleware.authLogin, auth.logout)

// Project
router.get('/project', dash.project)

// Admin (TODO: check for role)
router.get('/admin/board', middleware.authLogin, admin.showBoard)

module.exports = router
