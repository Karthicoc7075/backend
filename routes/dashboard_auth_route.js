const express = require('express');

const dashboardAuthRoutes = express.Router()

const {register,login,logout, forgetPassword} = require('../controllers/dashboard_auth_controller');


dashboardAuthRoutes.post('/register',register)

dashboardAuthRoutes.post('/login', login);

dashboardAuthRoutes.post('/logout', logout)

dashboardAuthRoutes.post('/reset-password', forgetPassword);

module.exports = dashboardAuthRoutes;