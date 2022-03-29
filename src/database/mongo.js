const mongo = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

mongo.connect("mongodb://" + process.env.DB_HOST + ":" + process.env.DB_PORT + "/" + process.env.DB_NAME);

const db = mongo.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", function () {
  console.log("There was a connection error");
});
