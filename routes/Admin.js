var express = require('express');
var adminrouter = express.Router();
const {isAdmin,authenticateToken}=require('../middlewares/authmiddleware')
const adminController=require('../controller/admincontroller')


adminrouter.get('/userlist',adminController.Userslist)
adminrouter.post('/Adminregistration',adminController.adminregpost)
adminrouter.post('/Adduser',adminController.adduser)
adminrouter.put('/updateuser/:id',adminController.editUsers)
adminrouter.delete('/deleteuser/:id',adminController.deleteUser)
adminrouter.post('/Adminlogin',adminController.Adminlogin)
adminrouter.get('/getuser',adminController.getuser)
adminrouter.get('/edituser/:userId',adminController.edituserget)

module.exports = adminrouter;
