/* eslint-disable no-undef */
const User = require('../../src/app/Models/User')
const assert = require('assert')

// Setup the test by creating a new user.
let user

beforeEach(() => {
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
    user.save()
        .then(() => done())
})

describe('Update document entries', () => {
    it('Updates a user by username', () => {
        User.findOneAndUpdate({ username: 'testuser' }, { $set: { username: 'testuser2' } })
            .then(() => {
                User.findOne({ username: 'testuser2' })
                    .then(user => {
                        assert(user.username === 'testuser2')
                        done()
                    })
            })
    })
})
