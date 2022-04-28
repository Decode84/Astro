const router = require('express').Router()
const authCon = require('./app/Http/AuthenticationController')
const adminCon = require('./app/Http/Admin/AdminController')
const projectCon = require('./app/Http/ProjectController')
const discordCon = require('./app/Http/ServiceControllers/DiscordController')
const homeCon = require('./app/Http/HomeController')
const TrelloAPI = require('./trello/trelloApi')
const githubAPI = require('./app/Http/GithubController')
const middleware = require('./app/Middleware/Authorization')
const calEventCon = require('./app/Http/calEventController')

const { createAccountLimit, loginLimit, mailLimit } = require('./app/Middleware/Rate')
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
router.post('/resetpass', mailLimit, authCon.resetPass)
router.post('/updatepass', authCon.updatePass)

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

// Discord
router.get('/discord', discordCon.discordAuth)
router.post('/discord', discordCon.discordAuth)

// Trello
router.get('/trello', TrelloAPI.trello)
router.get('/trello/callback', TrelloAPI.recieveToken)
router.get('/trello/newCard', TrelloAPI.newCard)
router.get('/trello/createCard', TrelloAPI.createCard)

// Trello API
router.get('/api/trello/boards', TrelloAPI.listBoards)
router.get('/api/trello/lists', TrelloAPI.listLists)

// Github API
router.post('/api/github/hook', githubAPI.hook)

// Calendar events
router.post('/add_event', calEventCon.event_add)
router.get('/get_events', calEventCon.event_get)

module.exports = router
