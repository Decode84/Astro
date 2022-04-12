const fetch = require('node-fetch');
const userController = require('../app/Http/UserController');
const projectController = require('../app/Http/ProjectController');
const Project = require('../app/Models/Project');
const { text } = require('express');

function trello(req, res) {

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

    try {
        if (project.categories.planning.services.trello.state === 'active') {
            const response = await fetch('https://api.trello.com/1/organizations?displayName=' + name + '&key=' + process.env.TRELLO_KEY + '&token=' + process.env.TRELLO_TOKEN, {
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

            console.log(project.categories.planning.services);

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
    let response;
    try {
        let organizationId = project.categories.planning.services.trello.organizationId;
        response = await fetch('https://api.trello.com/1/boards?name=' + name + '&idOrganization=' + organizationId + '&key=' + process.env.TRELLO_KEY + '&token=' + process.env.TRELLO_TOKEN, {
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
    newOrganization
}
