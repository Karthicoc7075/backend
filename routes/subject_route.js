const express = require('express');
const { uploadImage, allowedFormats } = require('../utils/multer'); 
const  tokenVerify  = require('../middleware/tokenVerify');

const subjectRouter = express.Router();

const { createSubject, getAllSubject, updateSubject, deleteSubject } = require('../controllers/subject_controller');

subjectRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createSubject);
subjectRouter.get('/allSubjects', tokenVerify, getAllSubject);
subjectRouter.put('/update/:subjectId', tokenVerify, uploadImage(allowedFormats.IMAGE), updateSubject);
subjectRouter.delete('/delete/:subjectId', tokenVerify, deleteSubject);

module.exports = subjectRouter;