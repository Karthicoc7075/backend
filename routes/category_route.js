const express = require('express');
const { uploadImage, allowedFormats } = require('../utils/multer'); 
const tokenVerify = require('../middleware/tokenVerify')
const categoryRouter = express.Router();

const { createCategory, getAllCategory, updateCategory, deleteCategory } = require('../controllers/category_controller');

categoryRouter.post('/create',tokenVerify, uploadImage(allowedFormats.IMAGE), createCategory);
categoryRouter.get('/allCategories',tokenVerify, getAllCategory);
categoryRouter.put('/update/:categoryId',tokenVerify, uploadImage(allowedFormats.IMAGE),updateCategory);
categoryRouter.delete('/delete/:categoryId',tokenVerify, deleteCategory);

module.exports = categoryRouter;