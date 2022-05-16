const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const appID = process.env.GITHUB_APP_ID
const appSecret = process.env.GITHUB_APP_SECRET
const { Octokit } = require('octokit')
const Project = require('../app/Models/Project')
const { createOAuthAppAuth } = require('@octokit/auth-oauth-app')
const auth = createOAuthAppAuth({
    clientType: 'oauth-app',
    clientId: appID,
    clientSecret: appSecret
})

async function setupProject (githubToken, project) {
    const octokit = new Octokit({
        auth: githubToken
    })
    // https://docs.github.com/en/rest/repos/repos#create-a-repository-for-the-authenticated-user
    const resp = await octokit.request('POST /user/repos', {
        name: project.name, // TODO: prompt user to provide name or retry with numbers
        description: 'A ProjectHub repository',
        private: true,
        has_issues: true,
        has_projects: true,
        has_wiki: true
    })
    if (resp.status === 201) {
        await putGitHubInDB(project, resp.data, githubToken)
        await createWebHook(resp.data.hooks_url, octokit)
    } else console.log("Error creating project for github")
}
async function addUserToProject(userToken, project) {
    console.log('Trying to add user to project')
    const user = new Octokit({
        auth: userToken
    })
    const { data } = await user.request("/user");
    const github = project.categories.development.services.github
    const owner = new Octokit({
        auth: github.ownerToken
    })
    const url = github.url.split('com')[1] + '/collaborators/' + data.name
    try {
        await owner.request('PUT ' + url)
        const { data } = await user.request('GET /user/repository_invitations', {})
        console.log(data)
        const invitationId = getInvitationId(data, github.id)
        console.log(invitationId)
        const accept = await user.request('PATCH /user/repository_invitations/{invitation_id}', {
            invitation_id: invitationId
        })
        console.log(accept)
        project.categories.development.services.github.members.push(userToken)
        await project.save()
        console.log("added " + data.name + " to project")
    } catch (e) {
        console.log('failed to add github user. They might already be linked to the project')
    }
}
async function putGitHubInDB (project, data, githubToken) {
    const github = {
        id: data.id,
        name: data.name,
        ownerToken: githubToken,
        url: data.url,
        htmlUrl: data.html_url,
        webHook: data.hooks_url,
        hookMessages: [],
        members: [ githubToken ]
    }
    // Update DB
    project.categories.development.services = { ...project.categories.development.services, github }
    project.markModified('categories.development.services')
    await project.save()
}
async function createWebHook (hookUrl, octokit) {
    await octokit.request('POST ' + hookUrl.split('com')[1], {
        active: true,
        events: [
            'push',
            'pull_request'
        ],
        config: {
            url: 'http://178.128.202.47/api/github/webhook',
            content_type: 'json',
            insecure_ssl: '0'
        }
    })
}
function getInvitationId(data, githubid) {
    for (const invitation of data) {
        if (invitation.repository.id === githubid)
            return invitation.id
    }
    return null
}
module.exports = { auth, setupProject, addUserToProject }
