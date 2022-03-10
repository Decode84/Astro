const mongo = require('mongoose');

mongo.connect('mongodb://127.0.0.1:27017/p2');

const db = mongo.connection;

db.on("error", function() {
    console.log("There was a connection error");
});