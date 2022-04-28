const User = require('../src/app/Models/User')
const assert = require('assert');

describe('Creating a user document in MongoDB', () => {
    it('Creates a New User', (done) => {
        const user = new User({
            name : 'Test User',
            username : 'testuser',
            email : 'test@test.test',
            password : 'testpassword',
            date: Date.now,
            services: {},

/*
let user;

beforeEach(() => {
    // Create a new user
    user = new User({
        name: 'Test User',
        username: 'testuser',
        email: 'test@test.test',
        password: 'test',
        date: Date.now,
        services: {},
        projectIDs: [],
        authentications: {}
    })
    user.save()
    .then(() => {

    })
    */