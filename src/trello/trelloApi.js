const fetch = require('node-fetch')
const userController = require('../app/Http/UserController')
const projectController = require('../app/Http/ProjectController')
const { text } = require('express');
const { response } = require('express');
const { send } = require('express/lib/response');

const trelloKey = 'e5b8e9efa5bf84e76b15d443eb9b5afc';

/**
 * @function trello
 * @description Redirects the user to the Trello authentication page.
 * @param {*} req 
 * @param {*} res 
 */
async function trello(req, res) {
    let return_url = 'http://localhost:4000/trello/callback';
    res.redirect('https://trello.com/1/authorize?return_url=' + return_url + '&callback_method=fragment&?expiration=30days&name=Project_Hub&response_type=fragment&scope=read,write,account&key=' + trelloKey);
}

/**
 * @function recieveToken
 * @description Recieves the token from the Trello callback.
 * @param {*} req 
 * @param {*} res 
 */
async function recieveToken(req, res) {
    let token;
    // If the token is undefined, then the user will execute the conversion script.
    if (req.query.token === undefined) {
        res.render("trello/Trello");
    }
    // If the token does not exist, then an error will be displayed.
    else if (req.query.token === "none") {
        res.send("No token was provided.");
    }
    // If the token exists, then the token will be saved to the user's account.
    else {
        token = req.query.token;

        // Save token to database
        let user = await userController.getUser(req.session.user._id);
        user.authentications = { ...user.authentications, trello: { token: token } };

        // Request for user's information from Trello.
        let response = await fetch('https://api.trello.com/1/members/me?key=' + trelloKey + '&token=' + token, {
            method: 'GET',
        });

        let text = await response.text();
        let json = JSON.parse(text);

        // Save user's information to database.
        user.authentications.trello.memberId = json.id

        user.markModified('authentications');
        await user.save();
        res.redirect('/project?projectId=' + req.query.projectId);
    }
}

/**
 * @function newOrganization
 * @description Creates a new organization for the user.
 * @param {String} name The name of the organization to be created.
 * @param {String} userId The id of the user who is creating the organization.
 * @param {String} projectId The id of the project that the organization is being created for.
 */
async function newOrganization(name, userId, projectId) {
    let organizationId;

    // Check whether Trello is active for the project.

    let project = await projectController.getProjectById(projectId);
    let user = await userController.getUser(userId);

    // Try to create the organization if trello is active for the project.
    try {
        if (project.categories.planning.services.trello.state === 'active') {
            const response = await fetch('https://api.trello.com/1/organizations?displayName=' + name + '&key=' + trelloKey + '&token=' + user.authentications.trello.token, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                }
            })

            const text = await response.text();

            const json = JSON.parse(text);

            organizationId = json.id;

            // Save organization id to database for future use.
            let service = { ...project.categories.planning.services };
            service.trello.organizationId = organizationId;
            project.markModified('categories.planning.services');

            project.categories.planning.services = service;

            await project.save();
        }
    }
    catch (e) {
        console.log(e);
    }

    // Invite members of a project to the trello organization.
    let userlist = project.members;
    for (let i = 0; i < userlist.length; i++) {
        let euser = await userController.getUser(userlist[i]);
        if (euser._id !== user._id) {
            if (user.categories.planning.services.trello.token !== undefined) {
                let url = 'https://api.trello.com/1/organizations/' + organizationId + '/members/' + euser.authentications.trello.memberId + '?type=normal' + '&key=' + trelloKey + '&token=' + user.authentications.trello.token;
                let response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                    }
                })
            }
        }
    }
}


/**
 * @function newBoard
 * @description Creates a new board for the user.
 * @param {String} name The name of the board to be created.
 * @param {String} projectId The id of the project that the board is being created for.
 */
async function newBoard(name, projectId, userId) {
    let project = await projectController.getProjectById(projectId);
    let user = await userController.getUser(userId);
    let response;
    // try to create the board if trello is active for the project for a given organization.
    try {
        let organizationId = project.categories.planning.services.trello.organizationId;
        response = await fetch('https://api.trello.com/1/boards?name=' + name + '&idOrganization=' + organizationId + '&key=' + trelloKey + '&token=' + user.authentications.trello.token, {
            method: 'POST',
        });
    }
    catch (e) {
        console.log(e);
    }
    let json;

    // If the board was created, then the board id will be saved to the project.
    try {
        const text = await response.text();
        json = JSON.parse(text);
        if (project.categories.planning.services.trello.boards == null) {
            project.categories.planning.services.trello.boards = [];
        }
        project.categories.planning.services.trello.boards = [];
        project.categories.planning.services.trello.boards.push({ name: json.name, id: json.id });
        project.markModified('categories.planning.services.trello');


        await project.save();
    }
    catch (e) {
        console.log(e);
    }
    return json.id;

}

/**
 * 
 * @param {String} userId The id of the user who wants to create a new list.
 * @param {String} boardId The id of the board that the list is being created for.
 * @param {String} name The name of the list to be created.
 */
async function newList(userId, boardId, name) {
    let user = await userController.getUser(userId);

    let url = 'https://api.trello.com/1/lists?name=' + name + '&idBoard=' + boardId + '&key=' + trelloKey + '&token=' + user.authentications.trello.token;
    let response = await fetch(url, {
        method: 'POST',
    });
    let text = await response.text();
    let json = JSON.parse(text);
}

/**
 * @function listBoards
 * @description Lists all the boards in the organization.
 * @param {*} req 
 * @param {*} res 
 */
async function listBoards(req, res) {
    if (req.query.projectId === undefined) {
        res.send(null);
    }
    else {
        let project = await projectController.getProjectById(req.query.projectId);
        let user = await userController.getUser(req.session.user._id);
        let organizationId = project.categories.planning.services.trello.organizationId;

        let boards;
        try {
            let url = 'https://api.trello.com/1/organizations/' + organizationId + '/boards?key=' + trelloKey + '&token=' + user.authentications.trello.token;
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            let text = await response.text();
            boards = text
        }
        catch (e) {
            res.send(null);
        }
        res.send(boards);
    }
}

/**
 * @function listLists
 * @description Returns all the lists in a given board.
 * @param {*} req 
 * @param {*} res 
 */
async function listLists(req, res) {

    if (req.query.projectId === undefined) {
        res.send(null);
    }
    else {
        try {
            let user = await userController.getUser(req.session.user._id);
            // Compose the url
            let url = 'https://api.trello.com/1/boards/' + req.query.boardId + '/lists?key=' + trelloKey + '&token=' + user.authentications.trello.token;
            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            let text = await response.text();
            res.send(text);
        }
        catch (e) {
            res.send(null);
        }
    }
}

/**
 * @function newCard
 * @description Renders an html page that allows the user to create a new card.
 * @param {*} req 
 * @param {*} res 
 */
async function newCard(req, res) {
    let user = await userController.getUser(req.session.user._id);
    let access = false;

    for (let i = 0; i < user.projectIDs.length; i++) {

        if (user.projectIDs[i]._id.toString() === req.query.projectId) {
            access = true;
        }
    }

    if (access) {
        res.render('trello/newCard');
    }
    else {
        res.send('You do not have access to this project.');
    }


}

/**
 * @function createCard
 * @description Creates a new card in the given list.
 * @param {*} req 
 * @param {*} res 
 */
async function createCard(req, res) {
    let user = await userController.getUser(req.session.user._id);

    let cardName = req.query.cardName;
    let cardDescription = req.query.cardDescription;
    let listId = req.query.list;

    let url = 'https://api.trello.com/1/cards?idList=' + listId + '&name=' + cardName + '&desc=' + cardDescription + '&key=' + trelloKey + '&token=' + user.authentications.trello.token;
    let response = await fetch(url, {
        method: 'POST',
    });
    res.redirect('/project?projectId=' + req.query.projectId); // ! Might change later don't know where to put the user.
}

/**
 * 
 * @param {String} name The name of the organization to create.
 * @param {String} projectId The id of the project that the organization is being created for.
 * @param {String} userId The id of the user who is creating the organization.
 */
async function setup_trello(name, projectId, userId) {
    await newOrganization(name, userId, projectId);
    let boardId = await newBoard('SCRUM', projectId, userId);

}

module.exports = {
    trello,
    listBoards,
    listLists,
    newCard,
    createCard,
    recieveToken,
    newOrganization
}
