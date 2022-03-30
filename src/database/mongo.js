const { ServerApiVersion } = require("mongodb");
const mongo = require("mongoose");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const credentials = path.join(__dirname, process.env.CERTIFICATE_PATH);
mongo.connect(process.env.CLUSTER_URI, {
  sslKey: credentials,
  sslCert: credentials,
  serverApi: ServerApiVersion.v1,
});

const db = mongo.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");
});

db.on("error", function () {
  console.log("There was a connection error");
});
