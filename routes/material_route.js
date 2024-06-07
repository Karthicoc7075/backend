const express = require('express');
const {uploadImageandFile, uploadImage,allowedFormats} = require('../utils/multer');
const tokenVerify  = require('../middleware/tokenVerify');

const materialRouter = express.Router();

const {createMaterial, getAllMaterials,  updateMaterial, deleteMaterial,updateStatus} = require('../controllers/material_controller');


materialRouter.post('/create', tokenVerify, uploadImageandFile(), createMaterial);
materialRouter.get('/allMaterials', tokenVerify, getAllMaterials);
materialRouter.put('/update/:materialId', tokenVerify, uploadImageandFile(), updateMaterial);
materialRouter.delete('/delete/:materialId', tokenVerify, deleteMaterial);
materialRouter.put('/updateStatus/:materialId', tokenVerify, updateStatus);

module.exports = materialRouter;