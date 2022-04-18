const router = require('express').Router()
const auth = require('../app/Http/AuthenticationController')
const admin = require('../app/Http/Admin/AdminController')
const ProjectController = require('../app/Http/ProjectController')
const TrelloAPI = require('../trello/trelloApi')
const middleware = require('../app/Middleware/Authorization')
const discord = require('../app/Http/DiscordController')
const proj = require('../app/Http/ProjectController')

const { createAccountLimit, loginLimit } = require('../app/Middleware/Rate')
const { authenticateValidation, registerValidation } = require('../app/Validation/AuthValidation')


/**
 * This web file is the router used to describe the correspondence
 * between the URL and the controller that will perform the action.
 */

// Authentication
router.get('/login', auth.showLogin)
router.get('/register', auth.showRegister)
router.get('/forgot', auth.showForgot)
router.post('/authenticate', loginLimit, authenticateValidation, auth.authenticate)
router.post('/signup', createAccountLimit, registerValidation, auth.signup)
router.post('/logout', middleware.authLogin, auth.logout)

// Project
router.get('/project', proj.project)

// Projects
router.get('/projects', proj.projects)

// Admin (TODO: check for role)
router.get('/admin/board', middleware.authLogin, admin.showBoard)

// Project
router.get('/project', ProjectController.project);

// Trello
router.get('/trello', TrelloAPI.trello);
router.get('/trello/callback', TrelloAPI.recieveToken);

// Discord
router.get('/discord', discord.discordAuth)
router.post('/discord', discord.discordAuth)

module.exports = router
