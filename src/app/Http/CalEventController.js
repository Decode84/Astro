const Project = require('../Models/Project')

async function addEventToDb (req, res) {
    const { projectId, time, name } = req.body
    const project = await Project.findById(projectId)

    const event = {
        name: name,
        start: time,
        end: time
    }

    project.events.push(event)
    await project.save()
    res.redirect('back')
}

async function getEventsFromDb (req, res) {
    const { projectId } = req.body
    const project = await Project.findById(projectId)
    res.json(project.events)
}

async function delEventFromDb (req, res) {
    const { projectId, eventId } = req.body

    const project = await Project.findById(projectId)

    if (project) {
        project.events = project.events.filter(event => event._id.toString() !== eventId)
        await project.save()
    } else {
        console.log('project not found')
    }

    res.redirect('back')
}

module.exports = { addEventToDb, getEventsFromDb, delEventFromDb }
