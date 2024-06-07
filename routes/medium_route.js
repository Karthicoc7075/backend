const express = require('express');
const {uploadImage,allowedFormats} = require('../utils/multer')
const tokenVerify  = require('../middleware/tokenVerify');

const mediumRouter = express.Router();

const { createMedium, getAllMedium, updateMedium, deleteMedium } = require('../controllers/medium_controller');

mediumRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createMedium);
mediumRouter.get('/allMediums', tokenVerify, getAllMedium);
mediumRouter.put('/update/:mediumId', tokenVerify, uploadImage(allowedFormats.IMAGE), updateMedium);
mediumRouter.delete('/delete/:mediumId', tokenVerify, deleteMedium);

module.exports = mediumRouter;