/* eslint-disable no-undef */
const chai = require('chai')
const User = require('../../src/app/Models/User')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const AuthenticationController = require('../../src/app/Http/AuthenticationController')

const assert = chai.assert
chai.use(sinonChai)

let user

beforeEach(() => {
    user = new User({
        name: 'testAuthUser',
        username: 'testAuthuser',
        email: 'test@test.test',
        password: '$2b$10$tNYovXfIfiqlbaxWUnFaAeWSE1/gsQIgW3NSNZbVEKEDYn7iF/oe2'
    })
    user.save()
        .then(() => done())
})

describe('AuthenticationController', () => {
    describe('authenticate function', () => {
        let req, res
        beforeEach(() => {
        // The request that has the input the function needs.
            req = {
                body: {
                    username: 'testAuthuser',
                    password: 'testPassword'
                },
                message: '',
                flash: function (type, message) {
                    this.body.message = message
                },
                session: {
                    user: '',
                    regenerate: function (callback) {
                        callback()
                    }
                }
            }

            // The response that has the output the function should return.

            res = {
                aurl: '',
                redirect: function (url) {
                    assert.equal(url, this.aurl)
                    this.done()
                }
            }
        })

        const sandbox = sinon.createSandbox()

        beforeEach(() => {

        })
        afterEach(function () {
            sinon.restore()
            sandbox.restore()
        })

        it('should redirect to projects if login is correct', function (done) {
            // Arrange
            res.aurl = '/projects'
            res.done = done

            console.log(res.aurl)

            // Act
            AuthenticationController.authenticate(req, res)
        })

        it('should flash incorrect password, when the password is wrong', function (done) {
            // Arrange
            res.aurl = '/login'
            res.done = done
            req.body.password = 'wrongPassword'
            res.redirect = function (url) {
                assert.equal(url, this.aurl)
                assert.equal(req.body.message, 'Incorrect password')
                done()
            }
            // Act
            AuthenticationController.authenticate(req, res)
        })
        it('should redirect to login if the user does not exist', function (done) {
            console.log(req.body.password)
            // Arrange
            res.aurl = '/login'
            res.done = done
            req.body.username = 'wrongUser'
            res.redirect = function (url) {
                assert.equal(url, this.aurl)
                assert.equal(req.body.message, 'User does not exists')
                done()
            }

            // Act
            AuthenticationController.authenticate(req, res)
        })
    })
})
