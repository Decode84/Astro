const mongo = require('mongoose');

const Schema = mongo.Schema;

projectSchema = new Schema({
    Id: String,
    name: String,
    categories: [
        {
            messaging: {
                services: {
                    discord: {
                        state: String,
                        token: String,
                        serverlink: String,
                    }
                }
            }
        },
        {
            planning: {
                services: {
                    trello: {
                        state: String,
                        token: String,
                        servicelink: String,
                    }
                }
            }
        },
        {
            development: {
                services: {
                    github: {
                        state: String,
                        token: String,
                        servicelink: String,
                    }
                }
            }
        },
        {
            document: {
                services: {
                    overleaf: {
                        state: String,
                        token: String,
                        servicelink: String,
                    }
                }
            }
        },
        {
            uml: {
                services: {
                    diagramsnet: {
                        state: String,
                        token: String,
                        servicelink: String,
                    }
                }
            }
        },
        {
            filesharing: {
                services: {
                    discord: {
                        state: String,
                        token: String,
                        serverlink: String,
                    },
                    github: {
                        state: String,
                        token: String,
                        servicelink: String,
                    }
                }
            }
        },
    ],
    members: [
        String
    ],
});

const projectModel = mongo.model('projectModel', projectSchema);

module.exports = projectModel;
