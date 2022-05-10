const User = require('../Models/User')
const Project = require('../Models/Project')
const gitHub = require('../../github/githubApi')
const { setupProject } = require('../../github/githubApi');
const authLink = 'https://github.com/login/oauth/authorize?client_id=7864fe4bf9aed444e764&scope=repo'
const TEMP_currentproject = '627380b04dd41fde76c9bf66' // TODO: use URL instead

async function page (req, res) {
    if (req.session.user) {
        const user = User.findById(req.session.user._id)
        if (user.services.github)
        {
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
        } else if (req.query.code) await handleAuth(req, res)
    }
    res.render('project/githubtemp', { AuthLink: authLink })
}
async function webHookReceiver (req) {
    try {
        // TODO: implement security for github webhook
        // console.log(req.body)
        console.log("Github id: " + req.body.repository.id)
        const project = await Project.findOne({ 'categories.development.services.github.id': req.body.repository.id })
        if (project) {
            const body = req.body
            let message = {
                user: { login: body.sender.login, id: body.sender.id, url: body.sender.html_url },
                repository: body.repository.id
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
                    timestamp: body.head_commit.timestamp,
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
        console.log(req.body)
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
        await setupProject(userAuth, req.session.user, TEMP_currentproject)
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
