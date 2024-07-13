const express = require('express');
const { uploadImage,uploadUpdateImage, allowedFormats } = require('../utils/multer'); 
const tokenVerify = require('../middleware/tokenVerify')
const categoryRouter = express.Router();

const { createCategory,getCategory, getAllCategory, updateCategory, deleteCategory } = require('../controllers/category_controller');

categoryRouter.post('/create',tokenVerify, uploadImage(allowedFormats.IMAGE), createCategory);
categoryRouter.get('/allCategories',tokenVerify, getAllCategory);
categoryRouter.get('/:categoryId', getCategory);

categoryRouter.put('/update/:categoryId',tokenVerify, uploadUpdateImage(allowedFormats.IMAGE),updateCategory);
categoryRouter.delete('/delete/:categoryId',tokenVerify, deleteCategory);

module.exports = categoryRouter;