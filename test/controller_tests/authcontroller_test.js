/* eslint-disable no-undef */
const chai = require('chai')
const mongoose = require('mongoose')
const User = require('../../src/app/Models/User')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const assert = require('assert')

const AuthenticationController = require('../../src/app/Http/AuthenticationController')

const expect = chai.expect
chai.use(sinonChai)

let user

beforeEach(() => {
    user = new User({
        name: 'Test AuthUser',
        username: 'testAuthuser',
        email: 'test@test.test',
        password: '$2b$10$tNYovXfIfiqlbaxWUnFaAeWSE1/gsQIgW3NSNZbVEKEDYn7iF/oe2'
    })
    user.save()
        .then(() => done())
})

describe('AuthenticationController', () => {
    describe('authenticate function', () => {
        const sandbox = sinon.createSandbox()
        afterEach(function () {
            sinon.restore()
            sandbox.restore()
        })

        // The request that has the input the function needs.
        const req = {
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

        const res = {
            redirect: function (url) {
                console.log("I've been called with this url: " + url)
            }
        }

        it('should redirect to projects if login is correct', async () => {
            // Arrange
            res.redirect = sandbox.stub().returns(Promise.resolve('/projects'))
            // Act
            await AuthenticationController.authenticate(req, res)

            console.log(res.redirect)

            // Assert
            expect(res.redirect).to.have.been.calledWith('/projects')
        })
        it('should flash incorrect password, when the password is wrong', () => {})
        it('should redirect to login if the user does not exist', () => {})
    })
})
