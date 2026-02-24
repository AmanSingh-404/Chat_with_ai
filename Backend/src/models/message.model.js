const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User"
    },
    chat:{
        type: mongoose.Schema.ObjectId,
        ref:"Chat"
    },
    content:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","model","system"],
        default: "user"
    }
},{
    timestamps:true
})