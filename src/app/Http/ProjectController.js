const projectModel = require('../Models/Project');
const Project = require('../Models/Project');
const uid = require('uid-safe');

// Empty dictionary to store the project data.
const projectData = {};

exports.project = (req, res) => {
    //res.render('project');
}

function generateProjectId() {
    // Generate a random project id.
    let projectId = '';
    projectId = uid.sync(18);
    console.log(projectId.length);
    return projectId;
}


function newProject(projectName) {
    // This function will also not provide authentication. Therefore, a function should handle that before this function is called.
    // TODO: Create a UI for the user to create a new project.
    // TODO: Save the project id to a user database.


    const project = new projectModel( { title: projectName } );
    // Generate a new project ID.
    project.Id = generateProjectId();

    // Save the project to the database.
    project.save();
}

// Modules to export for testing purposes.
module.exports = generateProjectId;