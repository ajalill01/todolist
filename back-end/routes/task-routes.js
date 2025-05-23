const express = require('express')
const {
    addTask,
    getTasks,
    finishTask,
    unFinishTask,
    updateTask,
    deleteTask
} = require('../controllers/task-controllers')
const authMiddleware = require('../middleware/auth-middleware')

const router = express.Router()

router.post('/add',authMiddleware,addTask)
router.get('/get',authMiddleware,getTasks)
router.patch('/finish', authMiddleware, finishTask);
router.patch('/unFinish', authMiddleware, unFinishTask);
router.put('/update',authMiddleware,updateTask)
router.delete('/delete',authMiddleware,deleteTask)

module.exports = router