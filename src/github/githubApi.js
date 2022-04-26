async function githubHook (req, res) {
    console.log('Github Hook', req.body)
    res.json({ ok: 1 })
}

module.exports = {
    githubHook
}
