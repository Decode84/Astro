const mongo = require('mongoose');

const Schema = mongo.Schema;

projectSchema = new Schema({
    name: String,
    description: String
});

const projectModel = mongo.model('projectModel', projectSchema);

testproject = new projectModel({
    name: 'Test Project',
    description: 'This is a test project'
});