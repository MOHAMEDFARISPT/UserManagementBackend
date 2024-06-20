const express = require('express');
const Userrouter = express.Router();
const userController=require('../controller/usercontroller');
const userModel = require('../model/userModel');
const { authenticateToken } = require('../middlewares/authmiddleware');
const multer = require('../config/multer');
const path = require('path');
const upload = require('../config/multer');



Userrouter.post('/register',userController.Userregister)
Userrouter.post('/login',userController.Userpost)
Userrouter.post('/profile',upload.single('image'),userController.profileUpload)
Userrouter.get('/user-profile/:userId',userController.imagedisplay)
Userrouter.post('/home',userController.userhome)
Userrouter.post('/logout',userController.logout)
Userrouter.get('/loaduser',authenticateToken,userController.loaduser)



module.exports = Userrouter;

