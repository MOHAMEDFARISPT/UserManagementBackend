const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
let AdminSchema=new mongoose.Schema({
    name:{
        type:String,
       required:true
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
    



   

    




module.exports=mongoose.model("Admin",AdminSchema)
