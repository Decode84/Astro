const router = require('express').Router()
const auth = require('../app/Http/AuthenticationController')
const admin = require('../app/Http/Admin/AdminController')
const project = require('../app/Http/ProjectController')
const middleware = require('../app/Middleware/Authorization')

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

// Admin (TODO: check for role)
router.get('/admin/board', middleware.authLogin, admin.showBoard)

// Project
router.get('/projects', project.showProjects)

module.exports = router
