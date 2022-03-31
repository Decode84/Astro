const mongo = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const dbConnectionType = process.argv[2];

if (dbConnectionType === "local") {
  mongo.connect("mongodb://" + process.env.LDB_HOST + ":" + process.env.LDB_PORT + "/" + process.env.LDB_NAME);
} else if (dbConnectionType === "cloud") {
  mongo.connect(`mongodb+srv://${process.env.CDB_USERNAME}:${process.env.CDB_PASSWORD}@cluster0.apnvx.mongodb.net/${process.env.CDB_NAME}?retryWrites=true&w=majority`);
} else {
  console.log("No or invalid database connection type given (cloud | local)");
}

const db = mongo.connection;

db.once("open", () => {
  console.log("Connected to MongoDB: " + dbConnectionType);
});

db.on("error", function () {
  console.log("There was a connection error: " + dbConnectionType);
});
