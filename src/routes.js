const router = require('express').Router()
const authCon = require('./app/Http/AuthenticationController')
const adminCon = require('./app/Http/Admin/AdminController')
const projectCon = require('./app/Http/ProjectController')
const homeCon = require('./app/Http/HomeController')
const TrelloAPI = require('./trello/trelloApi')
const middleware = require('./app/Middleware/Authorization')

const { createAccountLimit, loginLimit } = require('./app/Middleware/Rate')
const { authenticateValidation, registerValidation } = require('./app/Validation/AuthValidation')

/**
 * This web file is the router used to describe the correspondence
 * between the URL and the controller that will perform the action.
 */

// Home
router.get('/', homeCon.showHome)
router.get('/home', homeCon.showHome)

// Authentication
router.get('/login', authCon.showLogin)
router.get('/register', authCon.showRegister)
router.get('/forgot', authCon.showForgot)
router.get('/reset', authCon.showReset)
router.post('/authenticate', loginLimit, authenticateValidation, authCon.authenticate)
router.post('/signup', createAccountLimit, registerValidation, authCon.signup)
router.post('/logout', middleware.authLogin, authCon.logout)

// Project overview GET
router.get('/projects', projectCon.showProjects)
router.get('/create-project', projectCon.createProject)
router.get('/project', projectCon.showProject)
router.get('/edit', projectCon.editProject)
// Project overview POST
router.post('/create-project', projectCon.createProject)
router.post('/projects', projectCon.showProjects)
router.post('/project', projectCon.showProject)
router.post('/edit', projectCon.editProject)

// Admin (TODO: check for role)
router.get('/admin/board', middleware.authLogin, adminCon.showBoard)

// Trello
router.get('/trello', TrelloAPI.trello)
router.get('/trello/callback', TrelloAPI.recieveToken)

module.exports = router
