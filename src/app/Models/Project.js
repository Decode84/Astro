const mongo = require('mongoose');

const Schema = mongo.Schema;

projectSchema = new Schema({
    Id: String,
    name: String,
    categories:
    {
        messaging: {
            services: Schema.Types.Mixed,
        },
        planning: {
            services: Schema.Types.Mixed,
        },
        development: {
            services: Schema.Types.Mixed,
        },
        document: {
            services: Schema.Types.Mixed,
        },
        uml: {
            services: Schema.Types.Mixed,
        },
        filesharing: {
            services: Schema.Types.Mixed,
        }
    },

    members: [
        String
    ],
}, { strict: false });

const projectModel = mongo.model('project', projectSchema);

module.exports = projectModel;
