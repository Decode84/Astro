const User = require('../Models/User');

const password = "123456789";

const users = [
    new User({
        name: 'John',
        email: 'john@john.com',
        password' : password,
    }),
];

users.map(async (user, index) => {
    await user.save((err, result) => {
        if(index === users.length - 1) {
            console.log('Seeded the database');
            // Disconnect from database
        }
    })
});