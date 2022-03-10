const express = require('express');
const router = express.Router();

const AuthenticationController = require('../app/Http/AuthenticationController');

router.get('/login', AuthenticationController.login);
router.get('/register', AuthenticationController.register);
router.post('/authenticate', AuthenticationController.authenticate);
router.post('/store', AuthenticationController.store);
router.post('/logout', AuthenticationController.logout);

module.exports = router;