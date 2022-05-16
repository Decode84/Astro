const User = require('../../Models/User')
const Project = require('../../Models/Project')
const { setupProject, addUserToProject, auth } = require('../../../github/githubApi');
const authLink = 'https://github.com/login/oauth/authorize?client_id=7864fe4bf9aed444e764&scope=repo'

async function widget (req, res) {
    const user = await User.findById(req.session.user._id)
    if (!user.services?.github) {
        return { AuthLink: authLink }
    } else {
        const project = await Project.findById(req.params.id)
        if (!project.categories?.development?.services?.github) {
            // Create project
            await setupProject(user.services.github, project)
            // TODO: Handle case where project with that name exists
        }
        const github = project.categories.development.services.github
        if (!github.members.includes('' + user.services.github)) {
            // User hasn't been added to project yet
            await addUserToProject(user.services.github, project)
        }
        return {
            githubName: github.name,
            gitHubLink: github.htmlUrl,
            gitHubMessages: github.hookMessages
        }
    }
}
async function authReq (req, res) {
    const code = req.query.code
    const state = req.query.state.split('::')
    if (code) {
        await handleAuth(req, code)
    }
    res.redirect('/project/' + state[1])
}
async function webHookReceiver (req) {
    try {
        // TODO: implement security for github webhook
        // console.log(req.body)
        const project = await Project.findOne({ 'categories.development.services.github.id': req.body.repository.id })
        if (project) {
            const body = req.body
            let message = {
                user: { login: body.sender.login, id: body.sender.id, url: body.sender.html_url },
                repository: body.repository.name,
                timestamp: body.repository.updated_at
            }
            if (body.pull_request) {
                const pull = body.pull_request
                message.pull_request = {
                    action: body.action,
                    number: body.number,
                    url: pull.html_url,
                    title: pull.title,
                    body: pull.body,
                    head: pull.head.ref,
                    base: pull.base.ref,
                    commits: pull.commits,
                    additions: pull.additions,
                    deletions: pull.deletions,
                    changed_files: pull.changed_files,
                }
            } else if (body.pusher) {
                message.push = {
                    ref: body.ref,
                    message: body.head_commit.message,
                    url: body.head_commit.url
                }
            }
            project.categories.development.services.github.hookMessages.push(message)
            if (project.categories.development.services.github.hookMessages.length > 10) { project.categories.development.services.github.hookMessages.shift() }
            project.markModified('categories.development.services')
            project.save()
        } else console.log("Webhook couldn't find a project with: " + req.body.repository.id)
    } catch (e) {
        console.log('Webhook error: ' + e + "\n req.body:")
        // console.log(req.body)
    }
}
async function webHookProvider (req, res) {
    if (!(req.session.user && req.query.projectID))
        return
    const project = await Project.findOne({ _id: req.query.projectID, members: req.session.user._id })
    if (!project)
        return
    if (project.categories.development?.services?.github?.hookMessages)
        res.json(project.categories.development.services.github.hookMessages)
}
async function handleAuth (req, res) {
    try {
        const userAuth = await auth({
            type: 'oauth-user',
            code: req.query.code,
            state: req.query.state
        })
        await putUserInDB(userAuth, req.session.user.username)
    } catch (e) {
        console.log('Failed github auth: ' + e)
    }
}
async function putUserInDB (auth, username) {
    const user = await User.findOne({ username: username })
    user.services = { ...user.services, github: auth.token }
    await user.save()
    console.log(`Sucessfully linked ${username} with github account ${auth.clientId}`)
}

module.exports = { widget, webHookReceiver, webHookProvider, authReq }
