const express = require('express');
const {uploadImage,uploadUpdateImage,allowedFormats} = require('../utils/multer')
const tokenVerify  = require('../middleware/tokenVerify');

const mediumRouter = express.Router();

const { createMedium,getMedium, getAllMedium, updateMedium, deleteMedium } = require('../controllers/medium_controller');

mediumRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createMedium);
mediumRouter.get('/allMediums', tokenVerify, getAllMedium);
mediumRouter.get('/:mediumId', tokenVerify, getMedium);
mediumRouter.put('/update/:mediumId', tokenVerify, uploadUpdateImage(allowedFormats.IMAGE), updateMedium);
mediumRouter.delete('/delete/:mediumId', tokenVerify, deleteMedium);

module.exports = mediumRouter;