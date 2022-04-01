const projectController = require('./ProjectController');
const userController = require('./UserController');
const Project = require('../Models/Project');

test('recieves a 24 lenght id string', () => {
    expect(projectController.generateProjectId().length).toBe(24);
});

test('creation of a new project and finding it', async () => {
    let userId = userController.getUser('testUser').userName;
    let projectName = 'Test Project';
    projectController.newProject(projectName, userId);
    let project = await projectController.getProjectById(Project.Id);
    project.then(project => {
        expect(project.name).toBe(projectName);
    });

});

/*

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
*/