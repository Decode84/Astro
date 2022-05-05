/* eslint-disable no-undef */
const projectController = require('../../src/app/Http/ProjectController')
const Project = require('../../src/app/Models/Project')
const User = require('../../src/app/Models/User')
const assert = require('assert')

let newUser

beforeEach((done) => {
    // Create a new user
    newUser = new User({
        name: 'Test User',
        username: 'testuser',
        email: 'test@test.test',
        password: 'test',
        date: Date.now(),
        services: {},
        projectIDs: [],
        authentications: {}
    })
    newUser.save()
        .then(() => done())
})

describe('Creating a project', () => {
    it('Creates a new project', (done) => {
        User.findOne({ username: 'testuser' })
            .then(user => {
                projectController.newProject('Test Project', user._id)
                    .then(projectId => {
                        Project.findById(projectId)
                            .then(project => {
                                assert(project.name === 'Test Project')
                                assert(project.members.includes(user._id.toString()))
                                done()
                            })
                    })
            })
    })

    /*

    it('Creating a project with no name does not get saved', (done) => {
        User.findOne({ username: 'testuser' })
            .then(user => {
                projectController.newProject('', user._id)
                    .then(projectId => {
                        Project.findById(projectId)
                            .then(project => {
                                assert(project === null, 'A project with no name has been created.')
                                done()
                            })
                    })
            })
    }) */
})

describe('Read all projects in a user', () => {
    beforeEach((done) => {
        User.findOne({ username: 'testuser' })
            .then(user => {
                projectController.newProject('Test Project', user._id)
                    .then(results => {
                        return results
                    })
                projectController.newProject('Test Project 2', user._id)
                    .then(done())
            })
    })

    it('Read the projects', () => {
        User.findOne({ username: 'testuser' })
            .then(user => {
                projectController.getAllProjects(user._id.toString())
                    .then(projects => {
                        assert(projects[0].name === 'Test Project')
                        assert(projects[1].name === 'Test Project 2')
                        done()
                    })
            })
    })
})
