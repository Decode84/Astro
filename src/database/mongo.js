const mongo = require('mongoose');

console.log(require('dotenv').config())

mongo.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME)

const db = mongo.connection;

db.once('open', () => {
    console.log('Connected to MongoDB');
});

db.on("error", function () {
    console.log("There was a connection error");
});
