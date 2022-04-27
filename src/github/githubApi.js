async function githubHook (req, res) {
    console.log('Github Hook', req.body)
    res.json({ ok: 1 })
}

// Test
// Commit test
// Again commit test

module.exports = {
    githubHook
}
