const ProjectModel = require('../Models/Project')
const UserModel = require('../Models/User')
const userCon = require('./UserController')
const discordCon = require('./ServiceControllers/DiscordController')
const githubCon = require('./ServiceControllers/GithubController')

const ProjectController = {
    /// GETS //////////////////////////////////
    /**
     * @description show a single project page
     * @param {*} req
     * @param {*} res
     */
    showProject: async (req, res) => {
        const project = await ProjectController.getProjectById(req.params.id)
        if (project) {
            let memberNames = await Promise.all(project.members.map(async id => {
                const user = await userCon.getUserById(id)
                return user && user.username
            }))
            memberNames = memberNames.filter(member => member)

            const userId = req.session.user._id.toString()
            const userInProject = await ProjectController.isUserInProject(project, userId)
            if (!userInProject) {
                res.render('404')
                return
            }
            //const discordInfo = discordCon.discordWidget(req, res)
            const githubInfo = githubCon.widget(req, res)
            
            res.render('project/project', {
                project: project,
                projectMembers: memberNames,
                user: req.session.user,
                //discordInfo: await discordInfo,
                githubInfo: await githubInfo
            })
        } else {
            res.render('404')
        }
    },

    /**
     * @description Shows a list of all the users projects
     * @param {*} req
     * @param {*} res
     */
    showProjects: async (req, res) => {
        const projects = await ProjectController.getAllProjects(req.session.user._id)
        res.render('projects/overview', {
            projects: projects,
            user: req.session.user
        })
    },

    /**
     * @description Displays the create project page, and creates a new project if the user submits the form.
     * @param {*} req
     * @param {*} res
     */
    showCreateProject: async (req, res) => {
        res.render('projects/createProject', {
            userEmail: req.session.user.email,
            user: req.session.user
        })
    },

    /**
     * @description Edit name and invited users of a project.
     * @param {*} req
     * @param {*} res
     */
    showEditProject: async (req, res) => {
        const project = await ProjectController.getProjectById(req.params.id)
        if (project) {
            let memberEmails = await Promise.all(project.members.map(async id => {
                const user = await userCon.getUserById(id)
                return user && user.email
            }))
            memberEmails = memberEmails.filter(member => member)

            const userId = req.session.user._id.toString()
            const userInProject = await ProjectController.isUserInProject(project, userId)
            if (!userInProject) {
                res.render('404')
                return
            }

            res.render('projects/editProject', {
                project: project,
                projectMembers: memberEmails,
                user: req.session.user
            })
        }
    },

    /// POSTS //////////////////////////////////

    /**
     * @description The function will remove a project from the database. It will also remove the project from the user's project list.
     * The function runs asynchronously. There is no return value.
     * @param {string} projectId The id of the project to be removed.
     */
    delProject: async (req, res) => {
        const { projectId } = req.body

        // Get the list of users in the project.
        const project = await ProjectController.getProjectById(projectId)

        // Remove the project from the user's project list.
        project.members.forEach(async (member) => {
            const user = await userCon.getUserById(member)
            if (user) {
                await ProjectController.removeProjectFromUser(projectId, user._id)
            }
        })

        // Remove the project from the database.
        await ProjectModel.deleteOne({ _id: projectId })
        res.redirect('/projects')
    },

    /**
     * @description Update a project's name and invited users in the database
     * @param {Object} projectID
     * @param {String} projectName
     * @param {Array} invitedUsers
     */
    updateProject: async (req, res) => {
        const { projectId, emails, projectName, duration } = req.body

        const project = await ProjectController.getProjectById(projectId)
        if (project) {
            let usersSupposed = await Promise.all(emails.map(async email => await userCon.getUserByEmail(email)))
            let usersActually = await Promise.all(project.members.map(async id => await userCon.getUserById(id)))
            usersSupposed = usersSupposed.filter(member => member)
            usersActually = usersActually.filter(member => member)

            for await (const userActually of usersActually) {
                await ProjectController.removeProjectFromUser(project._id, userActually._id)
            }
            for await (const userSupposed of usersSupposed) {
                await ProjectController.addProjectToUser(project._id, userSupposed._id)
            }

            project.name = projectName
            project.members = usersSupposed.map(user => user._id)
            project.duration = { ...duration }
        }
        await project.save()
        res.redirect('back')
    },

    /**
     * @description Removes a user from a project.
     * @param {String} projectId
     * @param {String} UserId
     */
    leaveProject: async (req, res) => {
        const { userId, projectId } = req.body
        const project = await ProjectController.getProjectById(projectId)

        project.members.forEach(async (member, i, obj) => {
            if (member === userId) {
                // Remove user
                obj.splice(i, 1)

                // Remove the project from the user's project list
                await ProjectController.removeProjectFromUser(projectId, userId)

                //  TODO delete project if no users remains
            } else {
                console.log('User is not a member of ProjectController project.')
            }
        })
        // Save the project
        await project.save()
        res.redirect('/projects')
    },

    /**
     * @description Creates a new project in the database and adds it to the user's project list.
     * @param {String} projectName The name of the project.
     * @param {String} UserID The id of the user who created the project.
     * @returns {Promise<projectId>} The id of the project.
     */
    newProject: async (req, res) => {
        const { emails, projectName, duration } = req.body

        const project = new ProjectModel({ name: projectName })

        let users = await Promise.all(emails.map(async email => await userCon.getUserByEmail(email)))
        users = users.filter(member => member)

        users.forEach(async user => await ProjectController.addProjectToUser(project._id, user._id))
        project.members = users.map(user => user._id)
        project.duration = { ...duration }

        await project.save()
        res.redirect(`/project/${project._id}`)
    },

    /// HELPERS //////////////////////////////////

    /**
     * @description Removes a user from a project.
     * @param {String} projectId
     * @param {String} UserId
     */
    removeProjectFromUser: async (projectId, userId) => {
        const user = await userCon.getUserById(userId)
        if (user) {
            user.projectIDs.splice(user.projectIDs.indexOf(projectId), 1)
            await user.save()
        }
    },

    /**
     * @description Adds a user to a project.
     * @param {String} projectId
     * @param {String} UserId
     */
    addProjectToUser: async (projectId, userId) => {
        const user = await userCon.getUserById(userId)
        if (user) {
            user.projectIDs.push(projectId)
            await user.save()
        }
    },

    /**
     * @description Gets a project by id.
     * @param {String} id
     * @returns {Promise<Project>} The project.
     */
    getProjectById: async (id) => {
        try {
            const project = await ProjectModel.findById(id)
            return project
        } catch (error) {
            console.log(error)
        }
    },

    /**
     * @description Gets a list of all user's projects.
     * @returns {Promise<Array<Project>>} An array of projects.
     */
    getAllProjects: async (UserID) => {
        try {
            const userProjects = []
            const user = await UserModel.findById(UserID)
            for (const projectID of user.projectIDs) {
                const project = await ProjectController.getProjectById(projectID)
                userProjects.push(project)
            }
            return userProjects
        } catch (error) {
            console.log(error)
        }
    },

    /**
     * @description Adds a service to the project.
     * @param {String} projectId The id of the project.
     * @param {String} serviceCategory The category of which the service is in.
     * @param {String} serviceId The id of the service to be added.
     */
    addServiceToProject: async (projectId, serviceCategory, serviceId) => {
        // Get the project
        const project = await ProjectController.getProjectById(projectId)

        // Create new service object
        project.categories[serviceCategory].services = { ...project.categories[serviceCategory].services, [serviceId]: { state: 'active' } }
        
        await project.save()
    },

    /**
     * @description checks if user belongs to project
     * @param {String} projectId The id of the project.
     * @param {String} serviceCategory The category of which the service is in.
     * @param {String} serviceId The id of the service to be added.
     */
    isUserInProject: async (project, userId) => {
        let memberIds = await Promise.all(project.members.map(async id => {
            const user = await userCon.getUserById(id)
            return user && user._id.toString()
        }))
        memberIds = project.members.filter(member => member)

        let matched = false
        memberIds.forEach(member => {
            if (userId === member) {
                matched = true
            }
        })
        return matched
    }
}

module.exports = ProjectController
