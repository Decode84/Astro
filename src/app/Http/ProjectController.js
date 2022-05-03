const ProjectModel = require('../Models/Project')
const Project = require('../Models/Project')
const userCon = require('./UserController')
const User = require('../Models/User')
const DiscordCon = require('./ServiceControllers/DiscordController')

/// GETS //////////////////////////////////

/**
 * @function Shows a single projects page
 * @param {*} req
 * @param {*} res
 */
async function showProject (req, res) {
    getProjectById(req.params.id).then(async (project) => {
        if (project) {
            let memberNames = await Promise.all(project.members.map(async id => {
                const user = await userCon.getUserById(id)
                return user && user.username
            }))
            memberNames = memberNames.filter(member => member)

            res.render('project/project', {
                project: project,
                projectMembers: memberNames,
                user: req.session.user,
                discordInfo: await DiscordCon.discordAuth(req, res)
            })
        } else {
            res.render('404')
        }
    })
}

/**
 * @function Shows a list of all the users projects
 * @param {*} req
 * @param {*} res
 */
async function showProjects (req, res) {
    await getAllProjects(req.session.user._id).then(projects => {
        res.render('projects/overview', {
            projects: projects,
            user: req.session.user
        })
    })
}

/**
 * @function Displays the create project page, and creates a new project if the user submits the form.
 * @param {*} req
 * @param {*} res
 */
async function showCreateProject (req, res) {
    res.render('projects/createProject', { userEmail: req.session.user.email })
}

/**
 * @function Edit name and invited users of a project.
 * @param {*} req 
 * @param {*} res 
 */
async function showEditProject (req, res) {
    getProjectById(req.params.id).then(async (project) => {
        if (project) {
            let memberNames = await Promise.all(project.members.map(async id => {
                const user = await userCon.getUserById(id)
                return user && user.email
            }))
            memberNames = memberNames.filter(member => member)
            res.render('projects/editProject', {
                project: project,
                projectMembers: memberNames,
                user: req.session.user
            })
        } else {
            res.render('404')
        }
    })
}

/// POSTS //////////////////////////////////

/**
 * @function The function will remove a project from the database. It will also remove the project from the user's project list.
 * The function runs asynchronously. There is no return value.
 * @param {string} projectId The id of the project to be removed.
 */
async function delProject (req, res) {
    const { projectId } = req.body

    // Get the list of users in the project.
    const project = await getProjectById(projectId)

    // Remove the project from the user's project list.
    project.members.forEach((member) => {
        userCon.getUserById(member).then(user => {
            user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1)
            user.save()
        }).catch(() => console.log('user does not exist'))
    })

    // Remove the project from the database.
    await Project.deleteOne({ _id: projectId })
    res.redirect('/projects')
}

/**
 * @function Update a project's name and invited users in the database
 * @param {Object} projectID 
 * @param {String} projectName 
 * @param {Array} invitedUsers 
 */
async function updateProject (req, res) {
    const { projectId, emails, projectName, duration } = req.body

    await getProjectById(projectId).then(async (project) => {
        if (project) {
            project.name = projectName
            let usersSupposed = await Promise.all(emails.map(async email => await userCon.getUserByEmail(email)))
            let usersActually = await Promise.all(project.members.map(async id => await userCon.getUserById(id)))
            usersSupposed = usersSupposed.filter(member => member)
            usersActually = usersActually.filter(member => member)

            for (const userActually of usersActually) {
                await removeProjectFromUser(project._id, userActually._id)
            }

            for (const userSupposed of usersSupposed) {
                await addProjectToUser(project._id, userSupposed._id)
            }

            project.members = usersSupposed.map(user => user._id)
            project.duration = { ...duration }
        }
        await project.save()
        res.sendStatus('200')
    })
}

/**
 * @function Removes a user from a project.
 * @param {String} projectId
 * @param {String} UserId
 */
async function leaveProject (req, res) {
    const { userId, projectId } = req.body
    const project = await getProjectById(projectId)

    project.members.forEach((member, i, obj) => {
        if (member === userId) {
            // Remove user
            obj.splice(i, 1)

            // Remove the project from the user's project list
            userCon.getUserById(userId).then(user => {
                user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1)
                user.save()
            })

            //  TODO delete project if no users remains
        } else {
            console.log('User is not a member of this project.')
        }
    })
    // Save the project
    await project.save()
    res.redirect('/projects')
}

/**
 * @function Creates a new project in the database and adds it to the user's project list.
 * @param {String} projectName The name of the project.
 * @param {String} UserID The id of the user who created the project.
 * @returns {Promise<projectId>} The id of the project.
 */
async function newProject (req, res) {
    const { emails, projectName, duration } = req.body
    const project = new ProjectModel({ name: projectName })

    let users = await Promise.all(emails.map(async email => await userCon.getUserByEmail(email)))
    users = users.filter(member => member)

    users.forEach(user => addProjectToUser(project._id, user._id))
    project.members = users.map(user => user._id)
    project.duration = { ...duration }

    await project.save()
    res.redirect(`/project/${project._id}`)
}

/// HELPERS //////////////////////////////////

/**
 * @function Removes a user from a project.
 * @param {String} projectId
 * @param {String} UserId
 */
async function removeProjectFromUser (projectId, userId) {
    await userCon.getUserById(userId).then(user => {
        user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1)
        user.save()
    })
}

/**
 * @function Adds a user to a project.
 * @param {String} projectId
 * @param {String} UserId
 */
async function addProjectToUser (projectId, userId) {
    await userCon.getUserById(userId).then(user => {
        user.projectIDs.push(projectId)
        user.save()
    })
}

/**
 * @function Gets a project by id.
 * @param {String} id
 * @returns {Promise<Project>} The project.
 */
async function getProjectById (id) {
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
async function getAllProjects (UserID) {
    try {
        const userProjects = []
        const user = await User.findById(UserID)
        for (const projectID of user.projectIDs) {
            const project = await getProjectById(projectID)
            userProjects.push(project)
        }
        return userProjects
    } catch (error) {
        console.log(error)
    }
}

/**
 * @function Adds a service to the project.
 * @param {String} projectId The id of the project.
 * @param {String} serviceCategory The category of which the service is in.
 * @param {String} serviceId The id of the service to be added.
 */
async function addServiceToProject (projectId, serviceCategory, serviceId) {
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
    showCreateProject,
    showEditProject,
    delProject,
    leaveProject,
    newProject,
    getProjectById,
    getAllProjects,
    updateProject,
    addServiceToProject
}
