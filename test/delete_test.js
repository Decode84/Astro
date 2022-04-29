/* eslint-disable no-undef */
const User = require('../src/app/Models/User')
const assert = require('assert')

describe('Delete a User', () => {
    let user
    beforeEach((done) => {
    // Create a new user
        user = new User({
            name: 'Test User',
            username: 'testuser',
            email: 'test@test.test',
            password: 'test',
            date: Date.now(),
            services: {},
            projectIDs: [],
            authentications: {}
        })
        user.save().then(() => done())
    })

    it('Delete a user based on id', (done) => {
        User.findByIdAndRemove(user._id)
            .then(() => {
                User.findOne({ _id: user._id })
                    .then((user) => {
                        assert(user === null)
                        done()
                    })
            })
    })
})
