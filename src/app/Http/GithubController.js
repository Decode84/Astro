const User = require('../Models/User')
const Project = require('../Models/Project')
const gitHub = require('../../github/githubApi')
const authLink = 'https://github.com/login/oauth/authorize?client_id=7864fe4bf9aed444e764&scope=repo'
const TEMP_currentproject = '627380b04dd41fde76c9bf66' // TODO: use URL instead

async function page (req, res) {
    if (req.session.user) {
        if (req.query.code) await handleAuth(req, res)
        const project = await Project.findById(TEMP_currentproject)
        if (project.categories.development.services && project.categories.development.services.github) {
            const github = project.categories.development.services.github
            res.render('project/githubtemp', {
                githubName: github.name,
                gitHubLink: github.htmlUrl,
                gitHubMessages: github.hookMessages
            })
            return
        }
    }
    res.render('project/githubtemp', { AuthLink: authLink })
}
async function webHookReceiver (req) {
    try {
        // TODO: implement security for github webhook
        console.log("Webhook Req: " + JSON.stringify(req, null, 4))
        const push = req.body
        console.log("Webhook body: " + JSON.stringify(push, null, 4))
        const project = await Project.findOne({ services: { github: push.repository_id } })
        if (project) {
            project.categories.development.services.github.hookMessages.push({ event: push.event, action: push.action })
            if (project.categories.development.services.github.hookMessages.length > 10) { project.categories.development.services.github.hookMessages.shift() }
            project.markModified('categories.development.services')
            project.save()
        } else console.log("Webhook couldn't find a project with: " + push.repository_id)
    } catch (e) {
        console.log('Webhook error: ' + e)
    }
}
async function handleAuth (req, res) {
    try {
        const userAuth = await gitHub.auth({
            type: 'oauth-user',
            code: req.query.code,
            state: req.query.state
        })
        console.log(userAuth)
        await putUserInDB(userAuth, req.session.user.username)
        await gitHub.setupProject(userAuth, req.session.user, TEMP_currentproject)
        // TODO: Handle case where project with that name exists
    } catch (e) {
        console.log('Failed discord auth: ' + e)
    }
}

async function putUserInDB (auth, username) {
    const user = await User.findOne({ username: username })
    user.services = {
        ...user.services,
        github: { clientId: auth.clientId, clientSecret: auth.clientSecret, token: auth.token }
    }
    await user.save()
    console.log(`Sucessfully linked ${username} with github account ${auth.clientId}`)
}

module.exports = { page, webHookReceiver }
