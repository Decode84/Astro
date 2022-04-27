const Project = require('../Models/Project');

const tempProject = "624bfb0bb56cd83f0c16e346";

async function event_add(req, res) {

    console.log(req.body);
    const project = await Project.findById(tempProject);

    let event = {
        name: req.body.name,
        start: req.body.time,
        end: req.body.time 
    }

    project.events.push(event);
    project.save();
    res.redirect('back');
};

async function event_get(req, res){
    const project = await Project.findById(tempProject);
    res.json(project.events);
}

module.exports = {event_add, event_get}
