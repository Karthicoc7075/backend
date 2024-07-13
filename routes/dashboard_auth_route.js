const express = require('express');

const dashboardAuthRoutes = express.Router()

const {register,login,logout, changePassword} = require('../controllers/dashboard_auth_controller');


dashboardAuthRoutes.post('/register',register)

dashboardAuthRoutes.post('/login', login);

dashboardAuthRoutes.post('/logout', logout)

dashboardAuthRoutes.post('/change-password', changePassword);

module.exports = dashboardAuthRoutes;