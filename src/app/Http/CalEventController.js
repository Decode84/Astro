const Project = require('../Models/Project')

const tempProject = '624bfb0bb56cd83f0c16e346'

async function addEventToDb(req, res) {
    const project = await Project.findById(tempProject)

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
    const project = await Project.findById(tempProject)
    res.json(project.events)
}

module.exports = { addEventToDb, getEventsFromDb }
