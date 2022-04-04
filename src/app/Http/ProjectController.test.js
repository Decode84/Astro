const projectController = require('./ProjectController');
const userController = require('./UserController');
const Project = require('../Models/Project');

test('recieves a 24 lenght id string', () => {
    expect(projectController.generateProjectId().length).toBe(24);
});

test('creation of a new project and finding it', () => {
        // Create user
        let userName = 'testUser';
        let email = 'test@test.test';
        let hashedPassword = 'testPassword';
        userController.newUser(userName, email, hashedPassword);
        let user = userController.getUser(userName);

   
        let projectName = 'Test Project';
        projectController.newProject(projectName, user.userName);
        let project = projectController.getProjectById(Project.Id);
        project.then(project => {
            expect(project.name).toBe(projectName);
        });
    
});
