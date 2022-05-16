/* eslint-disable no-undef */
const chai = require('chai')
const User = require('../../src/app/Models/User')
const sinonChai = require('sinon-chai')
const Project = require('../../src/app/Models/Project')

const ProjectController = require('../../src/app/Http/ProjectController')
const { addProjectToUser } = require('../../src/app/Http/ProjectController')

const assert = chai.assert
chai.use(sinonChai)

let user
let project

describe('ProjectController', () => {
    beforeEach(async () => {
        user = new User({
            name: 'testProjUser',
            username: 'testProjuser',
            email: 'projectCon@test.test',
            password: '$2b$10$tNYovXfIfiqlbaxWUnFaAeWSE1/gsQIgW3NSNZbVEKEDYn7iF/oe2'
        })
        await user.save()
        project = new Project({
            name: 'testProj',
            duration: {
                startTime: new Date(2022, 1, 1),
                endTime: new Date(2022, 1, 2)
            },
            members: []
        })
        await project.save()
    })
    describe('newProject function', () => {
        let req, res
        beforeEach(() => {
            // The request that has the input the function needs.
            req = {
                body: {
                    emails: [
                        'test@test.test'
                    ],
                    projectName: 'uniqueProjectName',
                    duration: {
                        startTime: new Date(2022, 1, 1),
                        endTime: new Date(2022, 1, 2)
                    }
                }
            }

            res = {
                aurl: '',
                redirect: function (url) {
                    Project.findOne({ name: 'uniqueProjectName' })
                        .then(project => {
                            assert.equal(project.name, 'uniqueProjectName')
                            assert.equal(this.aurl + project._id.toString(), url)
                            this.done()
                        })
                }
            }
        })

        it('should create a new project in the database', (done) => {
            res.done = done
            res.aurl = '/project/'

            ProjectController.newProject(req, res)
        })
    })
    describe('addProjectToUser function', () => {
        it('should add a project to the user', async function () {
            // Arrange
            const project = await Project.findOne({ name: 'testProj' })
            const user = await User.findOne({ name: 'testProjUser' })

            // Act
            await ProjectController.addProjectToUser(project._id.toString(), user._id.toString())

            // Assert
            const updatedUser = await User.findOne({ name: 'testProjUser' })
            assert.equal(updatedUser.projectIDs.length, 1)
            assert.equal(updatedUser.projectIDs[0], project._id.toString())
        })
    })
    describe('removeProjectFromUser function', () => {
        it('should remove a project from the user', async function () {
            // Arrange
            const project = await Project.findOne({ name: 'testProj' })
            const user = await User.findOne({ name: 'testProjUser' })
            await ProjectController.addProjectToUser(project._id.toString(), user._id.toString())

            // Act
            await ProjectController.removeProjectFromUser(project._id.toString(), user._id.toString())

            // Assert
            const updatedUser = await User.findOne({ name: 'testProjUser' })
            assert.equal(updatedUser.projectIDs.length, 0)
        })
    })
    describe('isUserInProject', () => {
        it('should return true if the user is in the project', async function () {
            // Arrange
            const project = await Project.findOne({ name: 'testProj' })
            const user = await User.findOne({ name: 'testProjUser' })

            await ProjectController.addProjectToUser(project._id.toString(), user._id.toString())
            project.members.push(user._id.toString())
            await project.save()

            const updatedProject = await Project.findById(project._id.toString())
            // Act
            const result = await ProjectController.isUserInProject(updatedProject, user._id.toString())

            // Assert
            assert.equal(result, true)
        })

        it('should return false if the user is not in the project', async function () {
            // Arrange
            const project = await Project.findOne({ name: 'testProj' })
            const user = await User.findOne({ name: 'testProjUser' })

            // Act
            const result = await ProjectController.isUserInProject(project, user._id.toString())

            // Assert
            assert.equal(result, false)
        })
    })
    describe('delProject function', () => {
        let req, res
        beforeEach(async () => {
            req = {
                body: {
                    projectID: ''
                }
            }
            res = {
                redirect: function (url) {
                }
            }
        })
        it('should delete the project', async function () {
            // Arrange
            const project = await Project.findOne({ name: 'testProj' })
            const user = await User.findOne({ name: 'testProjUser' })
            req.body.projectId = project._id.toString()
            await addProjectToUser(project._id.toString(), user._id.toString())
            project.members.push(user._id.toString())
            await project.save()

            // Act
            await ProjectController.delProject(req, res)

            // Assert
            const deletedProject = await Project.findById(project._id.toString())
            assert.equal(deletedProject, null)
        })
    })
})
