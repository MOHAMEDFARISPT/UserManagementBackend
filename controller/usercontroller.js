const jwt = require('jsonwebtoken');
const UserModel=require('../model/userModel')
const bcrypt=require('bcrypt');
const userModel = require('../model/userModel');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
 const imagedisplay = async (req, res) => {
    try {
        
        const userId = req.params.userId
     

        const userData = await UserModel.findOne({ _id: userId })
         console.log("userDatauserDatauserDatauserData",userData)
        if (userData) {
            const imgFileName = userData.image;
            console.log("imgFileName",imgFileName)
            res.json({ url: imgFileName });
        } else {
            res.status(500).json({ message: "User Not Found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

 const profileUpload = async (req, res) => {
    try {
      console.log("///////////////////////////////huhiiihi")
        const userId = req.query.userId
        console.log("userId",userId)
       
        
        
        if (req.file) {

            const filePath = req.file?.path;


            const uploadOptions = {
                transformation: {
                    width: 300,  
                    height: 300, 
                    crop: 'fill' 
                }
            };


            console.log(filePath);
            const uploadedImage = await cloudinary.uploader.upload(filePath, uploadOptions);

            const userData = await userModel.findById(userId)
            
            if (userData) {
                
                
                userData.image =uploadedImage.secure_url.toString();
               
                
                await userData.save();
                res.json({ imagePath: uploadedImage.secure_url });
            } else {
                res.status(500).json({ message: "User Not found Or Internal Server Error" });
            }
        } else {
            res.status(500).json({ message: "Image Not found Try again" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
  

















const Userpost = async function(req, res, next) {
    console.log("req.body.email",req.body.email)
   
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
     
        if (!user) {
            
            return res.status(404).json({
                status: 404,
                message: 'email not found  Try again'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET, {
                expiresIn: '1hr'
            });
            return res.status(200).json({
                status: 200,
                message: `${user.name} logged in successfully`,
                data: { user, token, isAdmin: user.isAdmin }
            });
        } else {
            console.log("else case")
            return res.status(401).json({
                status: 401,
                message: 'Invalid password'
            });
        }
    } catch (error) {
        console.error(error);
        console.log("catch")
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error' | error.message,
        });
    }
};



const loaduser=async function(req,res){
   const userId=req.user.userId
    
    const userloaded=await UserModel.findById(userId)
    console.log(userloaded)
   if(userloaded){
    return res.status(200).json( userloaded)
   }else{
    return res.status(404).json({
        status:404,
        message:'user not found'

    })
   }


}







const Userregister = async function(req, res, next) {
    console.log("//reached in register post");
    console.log("req.body", req.body);
    try {
        const { name, username, email, password } = req.body;

        const existingUser = await UserModel.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            console.log("existing user");
            return res.status(400).json({
                status: 400,
                message: 'User already exists,please Login ',
                
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name: name,
            username: username,
            email: email,
            password: hashedPassword
        });

        // Save user details into the database
        await newUser.save();
        console.log("user registered successfully");

        // Customize the success message as needed
        const successMessage = 'User registered successfully';

        // Send a success response
        return res.status(201).json({
            status: 201,
            message: successMessage,
            data: newUser
        });
    } catch (error) {
        console.error('Registration error', error.message);
        console.log(error);

        // Send a generic server error response
        return res.status(500).json({
            status: 500,
            message: 'Server Error',
            error: error.message
        });
    }
};




const userhome=async function(req,res){
    
}

const logout=async function(req,res){

    console.log("logout succesfully")
    
    res.json({ message: 'Logout successful' });
}


module.exports={
    Userregister,
    Userpost,
    userhome,
    logout,
    profileUpload,
    loaduser,
    imagedisplay
    
}