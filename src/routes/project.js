const express = require('express')
const router = express.Router()

const ProjectController = require('../app/Http/ProjectController')

router.get('/', ProjectController.index)

module.exports = router