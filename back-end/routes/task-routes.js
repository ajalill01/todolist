const express = require('express')
const {
    addTask,
} = require('../controllers/task-controllers')
const authMiddleware = require('../middleware/auth-middleware')

const router = express.Router()

router.post('/add',authMiddleware,addTask)

module.exports = router