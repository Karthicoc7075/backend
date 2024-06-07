const express = require('express');
const  tokenVerify = require('../middleware/tokenVerify');

const notificationRouter = express.Router()
const {createNotification,notifications, deleteNotification} = require('../controllers/notification_controller');
const {uploadImage,allowedFormats} = require('../utils/multer')


notificationRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createNotification);
notificationRouter.get('/Allnotifications', tokenVerify, notifications);
notificationRouter.delete('/delete/:notificationId', tokenVerify, deleteNotification);

module.exports = notificationRouter;