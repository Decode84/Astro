const router = require('express').Router()
const authCon = require('./app/Http/AuthenticationController')
const projectCon = require('./app/Http/ProjectController')
const discordCon = require('./app/Http/ServiceControllers/DiscordController')
const homeCon = require('./app/Http/HomeController')
const TrelloAPI = require('./trello/trelloApi')
const githubController = require('./app/Http/ServiceControllers/GithubController')
const middleware = require('./app/Middleware/Authorization')
const calEventCon = require('./app/Http/CalEventController')

const { createAccountLimit, loginLimit, mailLimit } = require('./app/Middleware/Rate')
const { authenticateValidation, registerValidation } = require('./app/Validation/AuthValidation')
/**
 * This web file is the router used to describe the correspondence
 * between the URL and the controller that will perform the action.
 */

// Home
router.get('/', homeCon.showHome)
router.get('/home', homeCon.showHome)

// Authentication GET
router.get('/login', authCon.showLogin)
router.get('/register', authCon.showRegister)
router.get('/forgot', authCon.showForgot)
router.get('/reset', authCon.showReset)

// Authentication POST
router.post('/authenticate', loginLimit, authenticateValidation, authCon.authenticate)
router.post('/signup', createAccountLimit, registerValidation, authCon.signup)
router.post('/logout', middleware.authLogin, authCon.logout)
router.post('/resetpass', mailLimit, authCon.resetPass)
router.post('/updatepass', authCon.updatePass)

// Project overview GET
router.get('/projects', middleware.authLogin, projectCon.showProjects)
router.get('/create-project', middleware.authLogin, projectCon.showCreateProject)
router.get('/project/:id', middleware.authLogin, projectCon.showProject)
router.get('/edit-project/:id', middleware.authLogin, projectCon.showEditProject)

// Project overview POST
router.post('/create-project', middleware.authLogin, projectCon.newProject)
router.post('/edit-project', middleware.authLogin, projectCon.updateProject)
router.post('/leave-project', middleware.authLogin, projectCon.leaveProject)
router.post('/delete-project', middleware.authLogin, projectCon.delProject)

// Discord
router.get('/discord', middleware.authLogin, discordCon.discordAuth)

// Trello
router.get('/trello/:id', middleware.authLogin, TrelloAPI.trello)
router.get('/trello/callback/:id', middleware.authLogin, TrelloAPI.recieveToken)
router.get('/trello/newCard/:id', middleware.authLogin, TrelloAPI.newCard)
router.get('/trello/createCard/:id', middleware.authLogin, TrelloAPI.createCard)
router.get('/trello/createBoard/:id', middleware.authLogin, TrelloAPI.createBoard)
router.get('/trello/setup/:id', middleware.authLogin, TrelloAPI.setupTrello)

// Trello API
router.get('/api/trello/activate/:id', middleware.authLogin, TrelloAPI.activateTrello)
router.get('/api/trello/boards/:id', middleware.authLogin, TrelloAPI.listBoards)
router.get('/api/trello/lists/:id', middleware.authLogin, TrelloAPI.listLists)
router.get('/api/trello/cards/:id', middleware.authLogin, TrelloAPI.listCards)

// Github API
router.get('/api/github', middleware.authLogin, githubController.authReq)
router.post('/api/github/webhook', githubController.webHookReceiver)
router.get('/api/github/webhook', middleware.authLogin, githubController.webHookProvider)

// Calendar events
router.post('/add-event', middleware.authLogin, calEventCon.addEventToDb)
router.post('/get-events', middleware.authLogin, calEventCon.getEventsFromDb)
router.post('/del-event', middleware.authLogin, calEventCon.delEventFromDb)

//  The 404 Route (ALWAYS Keep this as the last route)
router.get('*', (req, res) => res.status(404).render('404'))

module.exports = router
