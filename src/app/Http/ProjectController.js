const projectModel = require('../Models/Project');
const Project = require('../Models/Project');
const userController = require('./UserController');
const uid = require('uid-safe');
const User = require('../Models/User');

// ! Included for debugging purposes.
const authenticationController = require('./AuthenticationController');

function project(req, res) {

}

// Async function to get a project by id
async function getProjectById(id) {
    try {
        const project = await Project.findById(id);
        return project;
    } catch (error) {
        console.log(error);
    }
}

// Async function to get all projects
async function getAllProjects() {
    try {
        const projects = await Project.find();
        return projects;
    } catch (error) {
        console.log(error);
    }
}

function generateProjectId() {
    // TODO: Check if the project id is already in the database.
    // Generate a random project id.
    let projectId = '';
    projectId = uid.sync(18);
    return projectId;
}


/**
 * @function Creates a new project in the database and adds it to the user's project list.
 * @param {String} projectName The name of the project.
 * @param {String} UserID The id of the user who created the project.
 * @returns {Promise<projectId>} The id of the project.
 */
async function newProject(projectName, UserID) {
    // This function will also not provide authentication. Therefore, a function should handle that before this function is called.
    // TODO: Create a UI for the user to create a new project.
    // TODO: Save the project id to a user database.

    // Generate a new project id and save it to the database.
    const project = new projectModel({ name: projectName });


    // Add initial user to the service.
    project.members.push(UserID);

    // Add the project to the user's project list.
    userController.getUser(UserID).then(user => {
        user.projectIDs.push(project._id);
        user.save();
    });


    // Save the project to the database.
    await project.save();
    return project._id;
}

//newProject('Test Project3', '624aace6e20f9986b02cc288');

/**
 * @function The function will remove a project from the database. It will also remove the project from the user's project list.
 * The function runs asynchronously. There is no return value.
 * @param {string} projectId The id of the project to be removed.
 */
async function delProject(projectId) {
    // TODO: Call the remove user function. When it is made.

    // Get the list of users in the project.
    const project = await getProjectById(projectId);
    const users = project.members;

    // Remove the project from the user's project list.
    for (let i = 0; i < users.length; i++) {
        userController.getUser(users[i]).then(user => {
            user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1);
            user.save();
        });
    }

    // Remove the project from the database.
    await Project.deleteOne({ _id: projectId });
}

async function addUserToProject(projectId, UserId) {
    // Get the project
    const project = await getProjectById(projectId);

    // Add the user to the project
    console.log(project.members.length);
    
    for (i = 0; i < project.members.length; i++) {
        if (project.members[i] != UserId) {
            // Add user
            project.members.push(UserId);

            // Add the project to the user's project list
            userController.getUser(UserId).then(user => {
                user.projectIDs.push(project._id);
                user.save();
            });

            // Save the project
            await project.save();

        } else {
            console.log('User is already a member of this project.');
        }
    }

}


async function removeUserFromProject(projectId, UserId) {
    // Get the project
    const project = await getProjectById(projectId);

    for (i = 0; i < project.members.length; i++) {
        if (project.members[i] == UserId) {
            // Remove user
            project.members.splice(i, 1);

            // Remove the project from the user's project list
            userController.getUser(UserId).then(user => {
                user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1);
                user.save();
            });
            console.log('user removed');
            // Save the project
            await project.save();

        } else {
            console.log('User is not a member of this project.');
        }
    }
    
    // Save the project
    await project.save();
}


// Modules to export for testing purposes.
module.exports = {
    project,
    generateProjectId,
    getProjectById,
    getAllProjects,
    addUserToProject
};

