const mongo = require('mongoose');

const Schema = mongo.Schema;

projectSchema = new Schema({
    Id: String,
    name: String,
    categories:
    {
        messaging: {
            services: {}
        },
        planning: {
            services: {}
        },
        development: {
            services: {}
        },
        document: {
            services: {}
        },
        uml: {
            services: {}
        },
        filesharing: {
            services: {}
        }
    },

    members: [
        String
    ],
}, { strict: false });

const projectModel = mongo.model('project', projectSchema);

module.exports = projectModel;
