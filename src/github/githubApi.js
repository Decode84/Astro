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

async function setupProject (userAuthenticationFromWebFlow, user, projectID) {
    const project = await Project.findById(projectID)
    const octokit = new Octokit({
        auth: userAuthenticationFromWebFlow.token
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
    console.log(resp.data)
    await putGitHubInDB(project, resp.data)
    await createWebHook(resp.data.hooks_url, octokit)
}
async function putGitHubInDB (project, data) {
    const github = {
        id: data.id,
        name: data.name,
        url: data.url,
        htmlUrl: data.html_url,
        webHook: data.hooks_url,
        hookMessages: []
    }
    // Update DB
    project.categories.development.services = { ...project.categories.development.services, github }
    project.markModified('categories.development.services')
    project.save()
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
module.exports = { auth, setupProject }
