const projectModel = require('../Models/Project');
const Project = require('../Models/Project');
const userController = require('./UserController');
const uid = require('uid-safe');
const User = require('../Models/User');

// ! Included for debugging purposes.
const authenticationController = require('./AuthenticationController');

function project(req, res) {
    //res.render('project');
}

function generateProjectId() {
    // TODO: Check if the project id is already in the database.
    // Generate a random project id.
    let projectId = '';
    projectId = uid.sync(18);
    return projectId;
}


async function newProject(projectName, UserID) {
    // This function will also not provide authentication. Therefore, a function should handle that before this function is called.
    // TODO: Create a UI for the user to create a new project.
    // TODO: Save the project id to a user database.

    // Generate a new project id and save it to the database.
    const project = new projectModel( { Id: generateProjectId(), name: projectName } );

    // Add initial user to the service.
    project.members.push(UserID);

    // Add the project to the user's project list.
    userController.getUser(UserID).then(user => {
        user.projects.push(project.Id);
        user.save();
    });


    // Save the project to the database.
    await project.save();
}

newProject("testProject", "test");


// Modules to export for testing purposes.
module.exports = {
    project,
    generateProjectId,
};