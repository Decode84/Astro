const projectController = require('./ProjectController');

test('recieves a 24 lenght id string', () => {
    expect(projectController.generateProjectId().length).toBe(24);
});