const { getPackageJSON, getIssues } = require('./github/githubApi')

class GithubController {
    async hook (req) {
        if (req.body != null) {
            const installationId = req.body.installation.id
            getPackageJSON(req.body.repository.full_name, installationId)
            // getIssues(req.body.repository.issues, installationId)
            console.log('Github Hook', getPackageJSON)
        }
    }
}

module.exports = new GithubController()
