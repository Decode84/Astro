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
    // This function will not respond to the client yet since a UI has not been created yet.
    // This function will also not provide authentication. Therefore, a function should handle that before this function is called.
    // TODO: Create a UI for the user to create a new project.

    const project = new projectModel( { title: "Test" } );
    // Generate a new project ID.
    project.Id = generateProjectId();
 
    project.save();
}

// Modules to export for testing purposes.
module.exports = generateProjectId;