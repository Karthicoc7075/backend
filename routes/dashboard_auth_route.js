const express = require('express');

const dashboardAuthRoutes = express.Router()
const auth = require('../middleware/auth');
const roles = require('../config/roles');
const {register,login,updateUser,deleteUser, logout, changePassword} = require('../controllers/dashboard_auth_controller');


dashboardAuthRoutes.post('/register',register)

dashboardAuthRoutes.post('/login', login);

dashboardAuthRoutes.put('/update-user/:userId',auth([roles.ADMIN]), updateUser);

dashboardAuthRoutes.delete('/delete-user/:userId',auth([roles.ADMIN]), deleteUser);

dashboardAuthRoutes.post('/logout', logout)

dashboardAuthRoutes.put('/change-password',auth([roles.ADMIN]), changePassword);

module.exports = dashboardAuthRoutes;