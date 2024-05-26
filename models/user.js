const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Student" , "Admin" , "Instructor"],
        required:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String
    }
})

module.exports = mongoose.model("User" , userSchema);