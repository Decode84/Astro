const projectModel = require('../Models/Project');
const Project = require('../Models/Project');
const uid = require('uid-safe');

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


function newProject(projectName, UserID) {
    // This function will also not provide authentication. Therefore, a function should handle that before this function is called.
    // TODO: Create a UI for the user to create a new project.
    // TODO: Save the project id to a user database.


    const project = new projectModel( { name: projectName } );
    // Generate a new project ID.
    project.Id = generateProjectId();

    // Save the project to the database.
    project.save();
}

// Modules to export for testing purposes.
module.exports = {
    project,
    generateProjectId,
};