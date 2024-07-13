const express = require('express');
const {uploadImage,uploadUpdateImage,allowedFormats} = require('../utils/multer')
const tokenVerify  = require('../middleware/tokenVerify');

const newsRouter = express.Router()
const {createNews,getAllNews,getNews,updateNews,deleteNews,statusUpdate} = require('../controllers/news_controller');

newsRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createNews);
newsRouter.get('/allNews', tokenVerify, getAllNews);
newsRouter.get('/:newsId', tokenVerify, getNews);
newsRouter.put('/update/:newsId', tokenVerify, uploadUpdateImage(allowedFormats.IMAGE), updateNews);
newsRouter.delete('/delete/:newsId', tokenVerify, deleteNews);
newsRouter.put('/updateStatus/:newsId', tokenVerify, statusUpdate);

module.exports = newsRouter;