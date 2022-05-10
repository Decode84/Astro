/* eslint-disable no-undef */
const chai = require('chai')
const User = require('../../src/app/Models/User')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const Project = require('../../src/app/Models/Project')

const ProjectController = require('../../src/app/Http/ProjectController')

const assert = chai.assert
chai.use(sinonChai)

let user
let project

describe('ProjectController', () => {
    beforeEach((done) => {
        user = new User({
            name: 'testProjUser',
            username: 'testProjuser',
            email: 'test@test.test',
            password: '$2b$10$tNYovXfIfiqlbaxWUnFaAeWSE1/gsQIgW3NSNZbVEKEDYn7iF/oe2'
        })
        user.save()
            .then(() => done())
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
})
