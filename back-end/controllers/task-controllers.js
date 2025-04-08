const express = require('express')
const Task = require('../model/Task');


const addTask = async(req,res)=>{
    try{

        const userId = req.userInfo.userId;
        const task = req.body

        const newtask = new Task({
            userId,
            task
        })

        await newtask.save()

        res.status(201).json({
            sucess : true,
            message : 'Task has created successfully'
        })
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : 'Error while adding task'
        })
    }
}


module.exports = {
    addTask
}