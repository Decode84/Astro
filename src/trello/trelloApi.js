const fetch = require('node-fetch');
const userController = require('../app/Http/UserController');
const projectController = require('../app/Http/ProjectController');
const Project = require('../app/Models/Project');
const { text } = require('express');
const { response } = require('express');

const trelloKey = 'e5b8e9efa5bf84e76b15d443eb9b5afc';

async function trello(req, res) {
    let return_url = 'http://localhost:4000/trello/callback';
    res.redirect('https://trello.com/1/authorize?return_url=' + return_url + '&callback_method=fragment&?expiration=30days&name=Project_Hub&response_type=fragment&scope=read,write,account&key=' + trelloKey);
}

async function recieveToken(req, res) {
    let token;
    if (req.query.token === undefined) {
        res.render("trello/Trello");
    }
    else if (req.query.token === "none") {
        res.send("No token was provided.");
    }
    else {
        token = req.query.token;

        // Save token to database
        let user = await userController.getUser(req.session.user._id);
        user.authentications = { ...user.authentications, trello: { token: token } };

        user.markModified('authentications');
        await user.save();

    }
}

async function setup_trello(name, projectId, userId) {
    await newOrganization(name, userId, projectId);
    await newBoard('SCRUM', projectId, userId);
}


/**
 * 
 * @param {String} name The name of the organization to be created.
 * @param {String} userId The id of the user who is creating the organization.
 * @param {String} projectId The id of the project that the organization is being created for.
 */
async function newOrganization(name, userId, projectId) {
    let organizationId;

    // Check whether Trello is active for the project.

    let project = await projectController.getProjectById(projectId);
    let user = await userController.getUser(userId);

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
}

/**
 * 
 * @param {String} name The name of the board to be created.
 * @param {String} projectId The id of the project that the board is being created for.
 */
async function newBoard(name, projectId, userId) {
    let project = await projectController.getProjectById(projectId);
    let user = await userController.getUser(userId);
    let response;
    try {
        let organizationId = project.categories.planning.services.trello.organizationId;
        response = await fetch('https://api.trello.com/1/boards?name=' + name + '&idOrganization=' + organizationId + '&key=' + trelloKey + '&token=' + user.authentications.trello.token, {
            method: 'POST',
        });
    }
    catch (e) {
        console.log(e);
    }
    try {
        const text = await response.text();
        const json = JSON.parse(text);
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
}

module.exports = {
    trello,
    recieveToken,
    newOrganization
}
