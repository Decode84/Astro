const Project = require('../Models/Project')

async function addEventToDb(req, res) {
    const project = await Project.findById(req.params.id)

    const event = {
        name: req.body.name,
        start: req.body.time,
        end: req.body.time
    }

    project.events.push(event)
    project.save()
    res.redirect('back')
}

async function getEventsFromDb(req, res) {
    const project = await Project.findById(req.params.id)
    res.json(project.events)
}

module.exports = { addEventToDb, getEventsFromDb }
