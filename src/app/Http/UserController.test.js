const userController = require('./UserController');

test('creation of a new user and finding it', () => {
    let userName = 'testUser';
    let email = 'test@test.test';
    let hashedPassword = 'testPassword';
    userController.newUser(userName, email, hashedPassword);
    let user = userController.getUser(userName);
    user.then(user => {
        expect(user.userName).toBe(userName);
        expect(user.email).toBe(email);
        expect(user.hashedPassword).toBe(hashedPassword);
    });
});