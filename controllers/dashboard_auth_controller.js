const DashboardUser = require('../models/dashboard_user_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/keys').secretKey;
const CustomError = require('../errors');

exports.register = async (req, res,next) => {
    try {
        const { username, email, password } = req.body;

        if ( !username || !email || !password) {
            throw new CustomError.BadRequestError('All fields are required');
        }
    
        const existingUser = await DashboardUser.findOne({ email: email });
        if (existingUser) {
          throw new CustomError.BadRequestError('User already exists');
       
          
        }
          if(existingUser && existingUser.username === username){
            throw new CustomError.BadRequestError('Username already exists');
        }
      

    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new DashboardUser({
            username: username,
            password: hashedPassword,
            email: email
        });
    
        const newUser = await user.save();
        const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });
        const data = { auth: newUser, token};
        return res.status(201).json({ message: 'User registered successfully', data });
    } catch (error) {
      next(error)
    }
};


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

        const token = jwt.sign({ userId: existingUser._id }, secretKey, { expiresIn: '10h' });
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

exports.forgetPassword =async(req,res)=>{

}