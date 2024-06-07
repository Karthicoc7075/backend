const express = require('express');

const authRouter = express.Router()

const {registerUser,logginUser,logoutUser, forgetPassword} = require('../controllers/auth_controller');


authRouter.post('/register',registerUser)

authRouter.post('/login', logginUser);

authRouter.post('/logout', logoutUser)

authRouter.post('/reset-password', forgetPassword);

module.exports = authRouter;