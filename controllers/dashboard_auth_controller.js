const DashboardUser = require('../models/dashboard_user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/keys').secretKey;
const CustomError = require('../errors');

exports.register = async (req, res,next) => {
    try {
        const { username, email, password,role,status } = req.body;

        if ( !username || !email || !password || !role || !status) {
            throw new CustomError.BadRequestError('All fields are required');
        }
    
        let existingUser = await DashboardUser.findOne({ email: email });
        if (existingUser) {
          throw new CustomError.BadRequestError('User already exists');
       
          
        }
         existingUser = await DashboardUser.findOne({username: username});

          if(existingUser && existingUser.username == username){
            throw new CustomError.BadRequestError('Username already exists');
        }
      

    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new DashboardUser({
            username: username,
            password: hashedPassword,
            email: email,
            role:role,
            status:status
        });
    
        const newUser = await user.save();
        const token = jwt.sign({ userId: newUser._id,role:newUser.role }, secretKey, { expiresIn: '24h' });
        const data = { auth: newUser, token};
        return res.status(201).json({ message: 'User registered successfully', data });
    } catch (error) {
      next(error)
    }
};

exports.updateUser = async(req,res,next) => {
    const userId = req.params.userId;
    
    try {
        const { username, email, role, status } = req.body;
        if (!username || !email || !role || !status) {
            throw new CustomError.BadRequestError('All fields are required');
        }
        const user = await DashboardUser.findById(userId);
        if (!user) {
            throw new CustomError.NotFoundError('User not found');
        }
        
        const userUpdatedData = { username, email, role, status };
     const updatedUser=   await DashboardUser.findByIdAndUpdate(userId, userUpdatedData, { new: true });

        return res.status(200).json({ message: 'User updated successfully', data:updatedUser });
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async(req,res,next) => {
    const userId = req.params.userId;
    try {
        const user = await DashboardUser.findById(userId);

        if (!user) {
            throw new CustomError.NotFoundError('User not found');
        }

        const deletedUser = await DashboardUser.findByIdAndDelete(userId);
        return res.status(200).json({ message: 'User deleted successfully', data: deletedUser });
    } catch (error) {
        next(error)
    }
}


exports.login = async (req, res,next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new CustomError.BadRequestError('All fields are required');
        }

        const existingUser = await DashboardUser.findOne({username: username});

        if(!existingUser){
       throw new CustomError.BadRequestError('User does not exist');
        }


        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
          throw new CustomError.BadRequestError('Wrong password');
        }

        if(existingUser.status == 'inactive'){
            throw new CustomError.BadRequestError('User is inactive');
        }

        const token = jwt.sign({ userId: existingUser._id,role:existingUser.role }, secretKey, { expiresIn: '24h' });
        const userData = { username: existingUser.username, email: existingUser.email, _id: existingUser._id, role: existingUser.role};
        const data = { auth:userData, token};
        return res.status(200).json({ message: 'User logged in successfully', data});

        } catch (error) {     
        next(error)
    } 
}       



exports.logout = async (req, res) => {
    try {
        return res.status(200).json({ message: 'User logged out successfully', data: null});
        } catch (error) {
        return res.status(500).json({ error: 'An error occurred while logging out the user' });
    }
}

exports.changePassword = async (req, res,next) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword ) {
            throw new CustomError.BadRequestError('All fields are required');
        }

        
    console.log(req.user);
        


        const user = await DashboardUser.findById(req.user.userId);



        if (!user) {
            throw new CustomError.NotFoundError('User not found');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new CustomError.BadRequestError('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password changed successfully', data: null });
    } catch (error) {
        next(error)
    }
}