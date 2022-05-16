const fetch = require('node-fetch')
const userController = require('../app/Http/UserController')
const projectController = require('../app/Http/ProjectController')
const ProjectController = require('../app/Http/ProjectController')
const { request } = require('express')
// const { text } = require('express')
// const response  = require('express')
// const { send } = require('express/lib/response')

const trelloKey = 'e5b8e9efa5bf84e76b15d443eb9b5afc'

const TrelloApi = {

    /**
     * @function activateTrello
     * @description Add trello as a service in the project.
     * @param {*} req
     * @param {*} res
     */
    activateTrello: async (req, res) => {
        await ProjectController.addServiceToProject(req.params.id, 'planning', 'trello')
        console.log('Did this really get triggered?')
        res.redirect('/project/' + req.params.id)
    },

    /**
     * @function trello
     * @description Redirects the user to the Trello authentication page.
     * @param {*} req
     * @param {*} res
     */
    trello: async (req, res) => {
        const returnUrl = 'http://localhost:4000/trello/callback/' + req.params.id
        res.redirect('https://trello.com/1/authorize?return_url=' + returnUrl + '&callback_method=fragment&?expiration=30days&name=Project_Hub&response_type=fragment&scope=read,write,account&key=' + trelloKey)
    },

    /**
     * @function recieveToken
     * @description Recieves the token from the Trello callback.
     * @param {*} req
     * @param {*} res
     */
    recieveToken: async (req, res) => {
        let token

        // If the token is undefined, then the user will execute the conversion script.
        // Else-If the token does not exist, then an error will be displayed.
        // Else the token exists, then the token will be saved to the user's account.
        if (req.query.token === undefined) {
            res.render('trello/Trello')
        } else if (req.query.token === 'none') {
            res.send('No token was provided.')
        } else {
            token = req.query.token

            // Save token to database
            const user = await userController.getUserById(req.session.user._id)
            user.authentications = {
                ...user.authentications,
                trello: {
                    token: token
                }
            }

            // Request for user's information from Trello.
            const response = await fetch('https://api.trello.com/1/members/me?key=' + trelloKey + '&token=' + token, {
                method: 'GET'
            })

            const text = await response.text()
            const json = JSON.parse(text)

            // Save user's information to database.
            user.authentications.trello.memberId = json.id

            user.markModified('authentications')
            await user.save()
            res.redirect('/project/' + req.params.id)
        }
    },

    /**
     * @function newOrganization
     * @description Creates a new organization for the user.
     * @param {String} name The name of the organization to be created.
     * @param {String} userId The id of the user who is creating the organization.
     * @param {String} projectId The id of the project that the organization is being created for.
     */
    newOrganization: async (name, userId, projectId) => {
        let organizationId

        // Check whether Trello is active for the project.

        const project = await projectController.getProjectById(projectId)
        const user = await userController.getUserById(userId)

        // Try to create the organization if trello is active for the project.
        try {
            if (project.categories.planning.services.trello.state === 'active') {
                const response = await fetch('https://api.trello.com/1/organizations?displayName=' + name + '&key=' + trelloKey + '&token=' + user.authentications.trello.token, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json'
                    }
                })

                const text = await response.text()

                const json = JSON.parse(text)

                organizationId = json.id

                // Save organization id to database for future use.
                const service = {
                    ...project.categories.planning.services
                }
                service.trello.organizationId = organizationId
                project.markModified('categories.planning.services')

                project.categories.planning.services = service

                await project.save()
            }
        } catch (e) {
            console.log(e)
        }

        // Invite members of a project to the trello organization.
        const userlist = project.members
        for (let i = 0; i < userlist.length; i++) {
            const euser = await userController.getUserById(userlist[i])
            if (euser._id !== user._id) {
                if (user.authentications.trello.token !== undefined) {
                    const url = 'https://api.trello.com/1/organizations/' + organizationId + '/members/' + euser.authentications.trello.memberId + '?type=normal' + '&key=' + trelloKey + '&token=' + user.authentications.trello.token
                    await fetch(url, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json'
                        }
                    })
                }
            }
        }
    },

    /**
     * @function newBoard
     * @description Creates a new board for the user.
     * @param {String} name The name of the board to be created.
     * @param {String} projectId The id of the project that the board is being created for.
     */
    newBoard: async (name, projectId, userId) => {
        const project = await projectController.getProjectById(projectId)
        const user = await userController.getUserById(userId)

        let response
        // try to create the board if trello is active for the project for a given organization.
        try {
            const organizationId = project.categories.planning.services.trello.organizationId
            response = await fetch('https://api.trello.com/1/boards?name=' + name + '&idOrganization=' + organizationId + '&key=' + trelloKey + '&token=' + user.authentications.trello.token, {
                method: 'POST'
            })
        } catch (e) {
            console.log(e)
        }
        let json

        // If the board was created, then the board id will be saved to the project.
        try {
            const text = await response.text()
            json = JSON.parse(text)
            if (project.categories.planning.services.trello.boards == null) {
                project.categories.planning.services.trello.boards = []
            }
            project.categories.planning.services.trello.boards = []
            project.categories.planning.services.trello.boards.push({
                name: json.name,
                id: json.id
            })
            project.markModified('categories.planning.services.trello')

            await project.save()
        } catch (e) {
            console.log(e)
        }
    },

    /**
     *
     * @param {String} userId The id of the user who wants to create a new list.
     * @param {String} boardId The id of the board that the list is being created for.
     * @param {String} name The name of the list to be created.
     */
    newList: async (userId, boardId, name) => {
        const user = await userController.getUserById(userId)

        const url = 'https://api.trello.com/1/lists?name=' + name + '&idBoard=' + boardId + '&key=' + trelloKey + '&token=' + user.authentications.trello.token
        const response = await fetch(url, {
            method: 'POST'
        })
        const text = await response.text()
        JSON.parse(text)
    },

    /**
     * @function listBoards
     * @description Lists all the boards in the organization.
     * @param {*} req
     * @param {*} res
     */
    listBoards: async (req, res) => {
        if (req.params.id === undefined) {
            res.send(null)
        } else {
            const project = await projectController.getProjectById(req.params.id)
            const user = await userController.getUserById(req.session.user._id)
            const organizationId = project?.categories?.planning?.services?.trello?.organizationId

            try {
                const url = 'https://api.trello.com/1/organizations/' + organizationId + '/boards?key=' + trelloKey + '&token=' + user.authentications.trello.token
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                })
                const text = await response.text()
                const boards = text
                res.send(boards)
            } catch (e) {
                res.send(null)
                console.log(`Error: ${e}`)
            }
        }
    },

    /**
     * @function listLists
     * @description Returns all the lists in a given board.
     * @param {*} req
     * @param {*} res
     */
    listLists: async (req, res) => {
        if (req.params.id === undefined) {
            res.send(null)
        } else {
            try {
                const user = await userController.getUserById(req.session.user._id)
                // Compose the url
                const url = 'https://api.trello.com/1/boards/' + req.query.boardId + '/lists?key=' + trelloKey + '&token=' + user.authentications.trello.token
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json'
                    }
                })
                const text = await response.text()
                res.send(text)
            } catch (e) {
                res.send(null)
            }
        }
    },

    /**
     * @function listCards
     * @description Returns all the cards in a given list.
     * @param {*} req
     * @param {*} res
     */
    listCards: async (req, res) => {
        const listId = req.query.listId
        const userId = req.session.user._id
        const user = await userController.getUserById(userId)

        let response
        try {
            const url = 'https://api.trello.com/1/lists/' + listId + '/cards?key=' + trelloKey + '&token=' + user.authentications.trello.token
            response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json'
                }
            })
        } catch (e) {
            res.send(null)
        }
        const cards = await response.text()
        res.send(cards)
    },

    /**
     * @function newCard
     * @description Renders an html page that allows the user to create a new card.
     * @param {*} req
     * @param {*} res
     */
    newCard: async (req, res) => {
        const user = await userController.getUserById(req.session.user._id)
        let access = false

        for (let i = 0; i < user.projectIDs.length; i++) {
            if (user.projectIDs[i] === req.params.id) {
                access = true
            }
        }

        if (access) {
            res.render('trello/newCard', {
                projectId: req.params.id
            })
        } else {
            res.send('You do not have access to this project.')
        }
    },

    /**
     * @function createCard
     * @description Creates a new card in the given list.
     * @param {*} req
     * @param {*} res
     */
    createCard: async (req, res) => {
        const user = await userController.getUserById(req.session.user._id)

        const cardName = req.query.cardName
        const cardDescription = req.query.cardDescription
        const listId = req.query.list

        const url = 'https://api.trello.com/1/cards?idList=' + listId + '&name=' + cardName + '&desc=' + cardDescription + '&key=' + trelloKey + '&token=' + user.authentications.trello.token
        await fetch(url, {
            method: 'POST'
        })
        res.redirect('/project/' + req.params.id) // ! Might change later don't know where to put the user.
    },

    createBoard: async (req, res) => {
        const userId = req.session.user._id
        const boardName = req.query.boardName
        const projectId = req.params.id

        await TrelloApi.newBoard(boardName, projectId, userId)

        res.redirect('/project/' + projectId)
    },

    /**
     *
     * @param {String} name The name of the organization to create.
     * @param {String} projectId The id of the project that the organization is being created for.
     * @param {String} userId The id of the user who is creating the organization.
     */
    setupTrello: async (req, res) => {
        const userId = req.session.user._id
        const projectId = req.params.id
        const project = await ProjectController.getProjectById(projectId)
        const name = project.name

        await TrelloApi.newOrganization(name, userId, projectId)
        await TrelloApi.newBoard('SCRUM', projectId, userId)

        res.redirect('/project/' + projectId)
    }
}

module.exports = TrelloApi
