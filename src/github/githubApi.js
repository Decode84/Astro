const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const appID = process.env.GITHUB_APP_ID
const appSecret = process.env.GITHUB_APP_SECRET
const { Octokit, App } = require("octokit");
const Project = require('../app/Models/Project')
const { createAppAuth } = require("@octokit/auth-app");
const { createOAuthAppAuth } = require("@octokit/auth-oauth-app");
const User = require('../app/Models/User');
const { request } = require('@octokit/request');
const auth = createOAuthAppAuth({
    clientType: "oauth-app",
    clientId: appID,
    clientSecret: appSecret,
});

/*start()
async function start() {
    
    const appAuthentication = await auth({
        type: "oauth-app",
    });
}*/
async function setupProject(userAuthenticationFromWebFlow, user, projectID) {
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
    // await createWebHook(resp.data.hooks_url, octokit) //TODO: CANT BE LOCALHOST!!!
    await putGitHubInDB(project, resp.data)
}
async function putGitHubInDB(project, data) {
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
async function createWebHook(hookUrl, octokit) {
    await octokit.request('POST ' + hookUrl.split("com")[1], {
        active: true,
        events: [
            'push',
            'pull_request'
        ],
        config: {
            url: 'https://localhost:4000/api/github/webhook', // TODO: THIS CANT BE LOCALHOST!!!
            content_type: 'json',
            insecure_ssl: '0'
        }
    })
}
module.exports = { auth, setupProject };

