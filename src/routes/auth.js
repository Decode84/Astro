const express = require('express')
const router = express.Router()

const AuthenticationController = require('../app/Http/AuthenticationController')

router.get("/login", AuthenticationController.login);
router.get("/register", AuthenticationController.register);
router.get("/forgot", AuthenticationController.forgot);
router.post("/authenticate", AuthenticationController.authenticate);
router.post("/signup", AuthenticationController.signup);
router.post("/logout", AuthenticationController.logout);

module.exports = router
