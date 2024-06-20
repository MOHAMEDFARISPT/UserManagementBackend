const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const { type } = require('express/lib/response')
let userSchema=new mongoose.Schema({
    name:{
        type:String,
       required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
       type: String,
       required:true,
       unique:true
    },
    password:{
      type:String,
      required:true
    },
    image:{
    type:String,

    }, 
   isAdmin:{
    type:Boolean,
    default:false
   },
   createdAt:{
    type:Date,
    default:Date.now
   }
   },{
    timestamps:true
   })
    



   

    




module.exports=mongoose.model("users",userSchema)
