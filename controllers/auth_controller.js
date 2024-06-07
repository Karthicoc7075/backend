const User = require('../models/auth_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/keys').secretKey;
const CustomError = require('../errors');

exports.registerUser = async (req, res,next) => {
    try {
        const { username, email, password } = req.body;

        if ( !username || !email || !password) {
            throw new CustomError.BadRequestError('All fields are required');
        }
    
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          throw new CustomError.BadRequestError('User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username: username,
            password: hashedPassword,
            email: email
        });
    
        const newUser = await user.save();
        const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });
        const data = { user: newUser, token};
        return res.status(201).json({ message: 'Admin registered successfully', data });
    } catch (error) {
      next(error)
    }
};


exports.logginUser = async (req, res,next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new CustomError.BadRequestError('All fields are required');
        }

        const user = await User.findOne({ email: email });
       
        if(!user){
       throw new CustomError.BadRequestError('User does not exist');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new CustomError.BadRequestError('Invalid password');
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '10h' });
        const data = { user, token};
        return res.status(200).json({ message: 'Admin logged in successfully', data});

        } catch (error) {     
        next(error)
    } 
}       

exports.logoutUser = async (req, res) => {
    try {
        return res.status(200).json({ message: 'Admin logged out successfully', data: null});
        } catch (error) {
        return res.status(500).json({ error: 'An error occurred while logging out the admin' });
    }
}

exports.forgetPassword =async(req,res)=>{

}