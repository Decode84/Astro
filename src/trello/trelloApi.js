const fetch = require('node-fetch');
const userController = require('../app/Http/UserController');
const projectController = require('../app/Http/ProjectController');
const Project = require('../app/Models/Project');
const { text } = require('express');

function trello(req, res) {

}



/*
function authUser() {
    fetch('https://trello.com/1/authorize?expiration=never&name=Project_Hub&scope=read&response_type=token&key=e5b8e9efa5bf84e76b15d443eb9b5afc')
}
*/
/**
 * 
 * @param {String} name The name of the organization to be created.
 * @param {String} userId The id of the user who is creating the organization.
 * @param {String} projectId The id of the project that the organization is being created for.
 */
async function newOrganization(name, userId, projectId) {
    let organizationId;
    const response = await fetch('https://api.trello.com/1/organizations?displayName=' + name + '&key=' + process.env.TRELLO_KEY + '&token=' + process.env.TRELLO_TOKEN, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        }
    })

    const text = await response.text();

    const json = JSON.parse(text);

    organizationId = json.id;


    let project = await projectController.getProjectById(projectId);

    let service = {...project.categories.planning.services};
    service.trello.organizationId = organizationId;
    service.update = !service.update; // This is a hack to force the update of the service.

    project.categories.planning.services = service;

    console.log(project.categories.planning.services);

    await project.save();
}

module.exports = {
    trello,
    newOrganization
}
