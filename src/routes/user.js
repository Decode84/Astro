const express = require("express");
const router = express.Router();

const UserController = require("../app/Http/UserController");

router.get("/", UserController.index);

module.exports = router;
