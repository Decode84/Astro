const { createAppAuth } = require('@octokit/auth-app')
const fs = require('fs')
const path = require('path')

/*
async function githubHook (req, res) {
    console.log('Github Hook', req.body)
    res.json({ ok: 1 })
}
*/

// Test1

async function githubRequest (url, installationId) {
    const token = await createJWT(installationId)
    const res = await fetch(`https://api.github.com${url}`, {
        headers: {
            authorization: `Bearer ${token}`,
            accept: 'application/vnd.github.machine-man-preview+json'
        }
    })
    return res.data
}

// Github App Private key
const _path = path.resolve(__dirname, '../github.pem')

fs.access(_path, fs.F_OK, (err) => {
    if (err) console.error(err)
})

const pem = fs.readFileSync(_path, 'utf8')

async function createJWT (installationId) {
    const auth = createAppAuth({
        id: process.env.GITHUB_APP_ID,
        privateKey: pem,
        installationId,
        clientId: process.env.GITHUB_APP_CLIENT_ID,
        clientSecret: process.env.GITHUB_APP_SECRET
    })

    const { token } = await auth({ type: 'installation' })
    return token
}

async function getPackageJSON (repo, installationId) {
    const pkg = await githubRequest(`/repos/${repo}/contents/package.json`, installationId)
        .then(res => res.content)
        .then(content => Buffer.from(content, 'base64').toString('utf8'))
    console.log('package.json:', pkg)
}

async function getIssues (repo, installationId) {
    const issue = await githubRequest(`/repos/${repo}/issues`, installationId)
        .then(res => res.content)
        .then(content => Buffer.from(content, 'base64').toString('utf8'))
    console.log('issue:', issue, issue)
}

module.exports = {
    getPackageJSON,
    getIssues
}
