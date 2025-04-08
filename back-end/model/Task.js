const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    userId:{
        type : String,
        required : true
    },
    task:{
        type : String,
        required : true
    },
    completed:{
        type : Boolean,
        default : false
    }
},{timestamps : true})

module.exports = mongoose.model('Task',taskSchema)
