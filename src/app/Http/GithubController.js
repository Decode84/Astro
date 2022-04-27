const { getPackageJSON, getIssues } = require('./github/githubApi')

class GithubController {
    async hook (req) {
        if (req.body != null) {
            const installationId = req.body.installation.id
            const log = getPackageJSON(req.body.repository.full_name, installationId)
            // getIssues(req.body.repository.issues, installationId)
            console.log('Github Hook', log)
        }
    }
}

module.exports = new GithubController()
