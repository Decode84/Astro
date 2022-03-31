const Project = require('../Models/Project');

function project(req, res) {

}

// Async function to get a project by id
async function getProjectById(id) {
    try {
        const project = await Project.findById(id);
        return project;
    } catch (error) {
        console.log(error);
    }
}

// Async function to get all projects
async function getAllProjects() {
    try {
        const projects = await Project.find();
        return projects;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    project,
    getProjectById,
    getAllProjects
}