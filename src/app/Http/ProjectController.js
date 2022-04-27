const ProjectModel = require('../Models/Project')
const Project = require('../Models/Project')
const userController = require('./UserController')
const uid = require('uid-safe')
const User = require('../Models/User')
const DiscordCon = require('./ServiceControllers/DiscordController')

// ! Included for debugging purposes.
const authenticationController = require('./AuthenticationController')

/**
 * @function Shows a list of all the users projects
 * @param {*} req
 * @param {*} res
 */

function showProjects(req, res) {
    if (req.method === 'POST') {
        delProject(req.body.projectId)
        res.redirect('projects/')
    } else {
        getAllProjects(req.session.user._id).then(projects => {
            res.render('projects/overview', {
                projects: projects,
                user: req.session.user
            })
        })
    }
}

/**
 * @function Shows a single projects page
 * @param {*} req
 * @param {*} res
 */
async function showProject(req, res) {
    res.render('project/project', {
        project: req.project,
        user: req.session.user,
        discordInfo: await DiscordCon.discordAuth(req, res)
    })
}

/**
 * @function Displays the create project page, and creates a new project if the user submits the form.
 * @param {*} req
 * @param {*} res
 */
function createProject(req, res) {
    if (req.method === 'POST') {
        const projectName = req.body.projectName
        const invitedUsers = req.body.emails
        const UserID = req.session.user._id

        newProject(projectName, UserID).then(projectId => {
            if (invitedUsers != null) {
                // Add the project to the user's project list.
                invitedUsers.forEach(user => {
                    User.find({ email: user }).then(user => {
                        addUserToProject(projectId, user[0]._id)
                    })
                })
            }
        })
        res.redirect('/projects/')
    } else {
        res.render('projects/createProject')
    }
}

/**
 * @function Edit name and invited users of a project.
 * @param {*} req 
 * @param {*} res 
 */
async function editProject(req, res) {
    // const projectId = mongoose.Types.ObjectId(url.split('=').pop())
    const projectId = req.body.projectID

    if (req.method === 'GET') {
        getProjectById(req.query.projectId).then(async (project) => {
            const projectObj = project
            const projectMembers = []

            for (const member of project.members) {
                console.log(member)
                const user = await userController.getUser(member)
                projectMembers.push(user.email)
            }

            console.log('members of project ' + projectMembers)
            res.render('projects/editProject', {
                project: projectObj,
                projectMembers: projectMembers,
                user: req.session.user
            })
        })
    }

    if (req.method === 'POST') {
        const projectName = req.body.projectName
        const invitedUsers = req.body.emails

        if (req.body.edit === 'true') {
            // updateProject(projectId, projectName, invitedUsers)
            updateProject(projectId, projectName, invitedUsers)
            res.redirect('/projects/')
        }
    }
}


/**
 * @function Gets a project by id.
 * @param {String} id
 * @returns {Promise<Project>} The project.
 */
async function getProjectById(id) {
    try {
        const project = await Project.findById(id)
        return project
    } catch (error) {
        console.log(error)
    }
}

/**
 * @function Gets a list of all user's projects.
 * @returns {Promise<Array<Project>>} An array of projects.
 */
async function getAllProjects(UserID) {
    try {
        const userProjects = [];
        const user = await User.findById(UserID);
        for (let projectID of user.projectIDs) {
            const project = await getProjectById(projectID);
            userProjects.push(project);
        }


        return userProjects;

    } catch (error) {
        console.log(error)
    }
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
    const project = new ProjectModel({ name: projectName })

    // Add initial user to the service.
    project.members.push(UserID)

    // Add the project to the user's project list.
    userController.getUser(UserID).then(user => {
        user.projectIDs.push(project._id)
        user.save()
    })

    // Save the project to the database.
    await project.save()
    return project._id
}

/**
 * @function Update a project's name and invited users in the database
 * @param {Object} projectID 
 * @param {String} projectName 
 * @param {Array} invitedUsers 
 */
async function updateProject(projectID, projectName, invitedUsers) {
    // Get the project
    const project = await getProjectById(projectID)

    // Update the project
    project.name = projectName

    console.log('invited users: ' + invitedUsers)
    if (invitedUsers.length < project.members.length) {
        // Remove users from the project
        for (const member of project.members) {
            // Get user from emails
            await User.find({ _id: member }).then(user => {
                if (!invitedUsers.includes(user[0].email)) {
                    // Remove user from project
                    removeUserFromProject(project._id, user[0]._id)
                }
            })
        }
    } else if (invitedUsers.length > project.members.length) {
        // Add users to the project
        for (const member of invitedUsers) {
            // Get user from emails
            await User.find({ email: member }).then(user => {
                if (!project.members.includes(user[0]._id)) {
                    // Add user to project
                    addUserToProject(projectID, user[0]._id)
                }
            })
        }
    } else {
        console.log('No new members')
        await project.save()
    }

    // Save the project to the database
    await project.save()
}

/**
 * @function The function will remove a project from the database. It will also remove the project from the user's project list.
 * The function runs asynchronously. There is no return value.
 * @param {string} projectId The id of the project to be removed.
 */
async function delProject(projectId) {
    // TODO: Call the remove user function. When it is made.

    // Get the list of users in the project.
    const project = await getProjectById(projectId)
    const users = project.members

    // Remove the project from the user's project list.
    for (let i = 0; i < users.length; i++) {
        userController.getUser(users[i]).then(user => {
            user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1)
            user.save()
        })
    }

    // Remove the project from the database.
    await Project.deleteOne({ _id: projectId })
}

/**
 * @function Adds a user to a project.
 * @param {String} projectId
 * @param {String} UserId
 */
async function addUserToProject(projectId, UserId) {
    // Get the project
    const project = await getProjectById(projectId)

    // Add the user to the project
    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i] !== UserId) {
            // Add user
            project.members.push(UserId)

            // Add the project to the user's project list
            userController.getUser(UserId).then(user => {
                user.projectIDs.push(project._id)
                user.save()
            })

            // Save the project
            await project.save();
        } else {
            console.log('User is already a member of this project.')
        }
    }
}

/**
 * @function Removes a user from a project.
 * @param {String} projectId
 * @param {String} UserId
 */
async function removeUserFromProject(projectId, UserId) {
    // Get the project
    const project = await getProjectById(projectId);
    console.log('projectId : ' + projectId)

    for (let i = 0; i < project.members.length; i++) {
        if (project.members[i] == UserId) {

            // Remove user
            project.members.splice(i, 1)

            // Remove the project from the user's project list
            userController.getUser(UserId).then(user => {
                user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1)
                user.save()
            })

        } else {
            console.log('User is not a member of this project.')
        }
    }
    // Save the project
    await project.save()
}

/**
 * @function Adds a service to the project.
 * @param {String} projectId The id of the project.
 * @param {String} serviceCategory The category of which the service is in.
 * @param {String} serviceId The id of the service to be added.
 */
async function addServiceToProject(projectId, serviceCategory, serviceId) {
    // Get the project
    const project = await getProjectById(projectId)
    // Create new service object
    project.categories[serviceCategory].services = { ...project.categories[serviceCategory].services, [serviceId]: { state: 'active' } }

    await project.save()
}

// Modules to export for testing purposes.
module.exports = {
    showProjects,
    showProject,
    createProject,
    delProject,
    editProject,
    newProject,
    getProjectById,
    getAllProjects,
    addUserToProject,
    removeUserFromProject
}
