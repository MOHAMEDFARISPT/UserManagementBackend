
const AdminModel = require('../model/AdminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const userModel = require('../model/userModel')

const adminregpost = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password } = req.body
        const exisitingAdmin = await AdminModel.findOne({ email })
        console.log("Admin", exisitingAdmin)
        if (exisitingAdmin) {
            return res.status(400).json({
                status: 400,
                message: 'Admin already exist please login'
            });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newAdmin = new AdminModel({
                name: name,
                email: email,
                password: hashedPassword
            })

            await newAdmin.save()
            const successMessage = 'Admin Registered Successfully'
            // Send a success response
            return res.status(201).json({
                status: 201,
                message: successMessage,
                data: newAdmin
            });
        }

    }
    catch (error) {
        console.error('Registration error', error.message);
        console.log(error);

        // Send a generic server error response
        return res.status(500).json({
            status: 500,
            message: 'Server Error',
            error: error.message
        });
    }

}





const Adminlogin = async (req, res) => {
    try {
        console.log("//////admin", req.body);
        const { email, password } = req.body;
        const Admin = await AdminModel.findOne({ email });
        if (!Admin) {
            console.log("ivide")
            return res.status(404).json({
                status: 404,
                message: 'wrong email Try again'
            })
        }


        const passwordMatch = await bcrypt.compare(password, Admin.password)
        console.log("passwordMatch", passwordMatch)

        if (passwordMatch) {
            const token = jwt.sign({ AdminId: Admin._id, isAdmin: true }, process.env.TOKEN_SECRET, {
                expiresIn: '1hr'
            });

            return res.status(200).json({
                status: 200,
                message: `${Admin.name} you logged successfull as Admin`,
                data: { Admin, token }

            })

        } else {
            return res.status(401).json({
                status: 401,
                message: 'Invalid Password'
            })
        }

    } catch (error) {
        console.error(error);
        console.log("catch")
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: error.message
        });

    }



};




const adduser = async (req, res) => {
    try {
        console.log("req.body", req.body)
        const { name, username, email, password } = req.body

        const userexist = await userModel.findOne({ email })
        console.log(userexist)
        if (!userexist) {

            const hashedpassword = await bcrypt.hash(password, 10)
            console.log(hashedpassword)
            const newuser = new userModel({
                name: name,
                username: username,
                email: email,
                password: hashedpassword,
            })

            await newuser.save()

            const successmessage = "user created successfully"
            return res.status(201).json({
                status: 201,
                message: successmessage,
                data: newuser
            })


        } else {
            return res.status(401).json({
                status: 401,
                message: 'user already exist',


            })

        }


    } catch (error) {
        console.error('user creating error', error.message);
        console.log(error);

        // Send a generic server error response
        return res.status(500).json({
            status: 500,
            message: 'Server Error',
            error: error.message
        });

    }

}


const getuser = async (req, res) => {
    try {
        console.log("///////////////////////////////////////////////////////")
        const query = req.query.search || '';
        console.log("query",query)
          // Use a regular expression to perform a case-insensitive search on multiple fields
          const searchRegex = new RegExp(query, 'i');

  console.log("seachregex",searchRegex)

      const  users = await userModel.find({
        $or:[
            {name:searchRegex},
            {username:searchRegex},
            {email:searchRegex}
        ]
      });
   
       console.log("userssssseeeei",users)
      if(!users || users.length<1){
        return res.status(401).json('user not found')
      }else{
        return res.status(200).json(users)
      }
    

     
        
    } catch (err) {
        console.log(err);


    }
}



const edituserget = (req, res) => {
    console.log("req.body", req.params.userId)

}















const Userslist = async (req, res) => {
    try {
        const query = req.query.search || '';
        const searchRegex = new RegExp(query, 'i');

        // Perform the search using the User model
        const users = await userModel.find({
            $or: [
                { firstname: searchRegex },
                { lastname: searchRegex },
                { username: searchRegex },
                { email: searchRegex },
            ],
        });

        if (!users || users.length < 1) {
            return res.status(404).json({
                status: 404,
                message: 'Users not found'
            });


        }
       

        return res.status(200).json({
            status: 200,
            message: 'Success',
            data: users
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: err.message
        });
    }
};

const editUsers = async (req, res, next) => {
    const userId = req.params.id;
    const updatedUserInfo = req.body;

    try {
        const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, updatedUserInfo, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'User updated successfully',
            data: updatedUser
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: err.message
        });
    }
};




const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'User deleted successfully',
            data: deletedUser
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: err.message
        });
    }
};


module.exports = {
    Userslist,
    editUsers,
    deleteUser,
    Adminlogin,
    adminregpost,
    adduser,
    getuser,
    edituserget

}