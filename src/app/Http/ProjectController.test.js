const generateProjectId = require('./ProjectController');

test('recieves a 24 lenght id string', () => {
    expect(generateProjectId().length).toBe(24);
});