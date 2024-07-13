const express = require('express');
const  tokenVerify  = require('../middleware/tokenVerify');
const { uploadImage, allowedFormats, uploadUpdateImage } = require('../utils/multer');
const languageRouter = express.Router();

const { createLanguage, getLanguage,getAllLanguage, updateLanguage, deleteLanguage } = require('../controllers/language_controller');

languageRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createLanguage);
languageRouter.get('/allLanguages', tokenVerify, getAllLanguage);
languageRouter.get('/:languageId', tokenVerify, getLanguage);
languageRouter.put('/update/:languageId', tokenVerify, uploadUpdateImage(allowedFormats.IMAGE), updateLanguage);
languageRouter.delete('/delete/:languageId', tokenVerify, deleteLanguage);

module.exports = languageRouter;