const express = require('express');
const { uploadImage,uploadUpdateImage, allowedFormats } = require('../utils/multer'); 
const  tokenVerify  = require('../middleware/tokenVerify');

const subjectRouter = express.Router();

const { createSubject,getSubject, getAllSubjects, updateSubject, deleteSubject } = require('../controllers/subject_controller');

subjectRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createSubject);
subjectRouter.get('/allSubjects', tokenVerify, getAllSubjects);
subjectRouter.get('/:subjectId', tokenVerify, getSubject);
subjectRouter.put('/update/:subjectId', tokenVerify, uploadUpdateImage(allowedFormats.IMAGE), updateSubject);
subjectRouter.delete('/delete/:subjectId', tokenVerify, deleteSubject);

module.exports = subjectRouter;