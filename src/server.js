const express = require("express");
const app = express();
const path = require("path");
const expressEjsLayout = require("express-ejs-layouts");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Template Engine
app.set("views", path.join(__dirname, "../src/resources/views"));
app.set("view engine", "ejs");
app.use(expressEjsLayout);

// Public assets
app.use(express.static(path.join(__dirname, "../public")));

// Routes path
app.use("/", express.static('public'), require("./routes/home"));
app.use("/auth", express.static('public'), require("./routes/auth"));
app.use("/api/users", express.static('public'), require("./routes/user"));

// Database
require("./database/mongo");

// Server app
const PORT = process.env.PRI_SERVER_PORT || process.env.SEC_SERVER_PORT;
app.listen(PORT, (err) => {
  console.log(`Homepage hosted here: http://localhost:${PORT}/`);
  if (err) {
    console.log(err);
  }
});
