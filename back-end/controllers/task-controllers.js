const express = require('express')
const Task = require('../model/Task');


const addTask = async(req,res)=>{
    try{

        const userId = req.userInfo.userId;
        const {task} = req.body

        const newtask = new Task({
            userId,
            task
        })

        await newtask.save()

        res.status(201).json({
            success : true,
            message : 'Task has created successfully',
            task : task
        })
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : 'Error while adding task'
        })
    }
}

const getTasks = async(req,res)=>{
    try{
        const userId = req.userInfo.userId

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page-1)*limit

        const tasks = await Task.find({userId}).skip(skip).limit(limit).sort({createdAt : -1})

        const total = await Task.countDocuments({userId})

        res.status(200).json({
            success: true,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            tasks
        });

    }
    catch(e){
        res.status(500).json({
            success : false,
            message : 'Error while getting tasks'
        })
        console.log(e)
    }
}

const finishTask = async(req,res)=>{
    try{
        const userId = req.userInfo.userId
        const taskId = req.query.id

        const finishedTask = await Task.findOne(taskId)

        if(!finishedTask){
            return res.status(404).json({
                success : false,
                message : 'Task not found'
            })
        }


        finishedTask.completed = true

        await finishedTask.save()

        res.status(200).json({
            success : true,
            task : finishedTask,
            message : 'Task has been selected as finished'
        })
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : 'Error while finish task'
        })
        console.log(e)
    }
}

const unFinishTask = async(req,res)=>{
    try{
        const userId = req.userInfo.userId
        const taskId = req.query.id

        const finishedTask = await Task.findOne(taskId)

        if(!finishedTask){
            return res.status(404).json({
                success : false,
                message : 'Task not found'
            })
        }


        finishedTask.completed = false

        await finishedTask.save()

        res.status(200).json({
            success : true,
            task : finishedTask,
            message : 'Task has been selected as finished'
        })
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : 'Error while finish task'
        })
        console.log(e)
    }
}

const updateTask = async(req,res)=>{
    try{
        const userId = req.userInfo.userId
        const taskId = req.query.id
        const taskNewText = req.body.text

        const taskUpdated = await Task.findOne({ _id: taskId, userId });

        if(!taskUpdated){
            return res.status(404).json({
                success : false,
                message : 'Task not found'
            })
        }


        taskUpdated.task = taskNewText

        await taskUpdated.save()

        res.status(202).json({
            success : true,
            message : 'Task has been updated',
            task : taskUpdated
        })


    }
    catch(e){
        res.status(500).json({
            success : false,
            message : 'Error while updating task'
        })
        console.log(e)
    }
}

const deleteTask = async(req,res)=>{
    try{
        const userId = req.userInfo.userId;
        const taskId = req.query.taskId;

        if(!taskId){
            return res.status(404).json({
                success : false,
                message : 'No taskID'
            })
        }

        const taskDeleted = await Task.findOneAndDelete({ _id: taskId, userId });

        if(!taskDeleted){
            return res.status(404).json({
                success : false,
                message : 'Task not found'
            })
        }

        res.status(200).json({
            success : true,
            message : 'Task has been deleted',
            task : taskDeleted
        })
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : 'Error while deleting task'
        })
        console.log(e)
    }
}


module.exports = {
    addTask,
    getTasks,
    finishTask,
    unFinishTask,
    updateTask,
    deleteTask
}
