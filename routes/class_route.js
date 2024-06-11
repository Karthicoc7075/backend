const express = require('express')
const { uploadImage, allowedFormats,uploadUpdateImage } = require('../utils/multer'); 
const tokenVerify = require('../middleware/tokenVerify')
const classRouter = express.Router()
const {createClass, getAllClass,getClass, updateClass, deleteClass, getClassSubjects, createClassSubject, deleteClassSubject} = require('../controllers/class_controller')

classRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createClass)
classRouter.get('/Allclasses', tokenVerify, getAllClass)
classRouter.get('/:classId', tokenVerify, getClass)
classRouter.put('/update/:classId', tokenVerify, uploadUpdateImage(allowedFormats.IMAGE), updateClass)
classRouter.delete('/delete/:classId', tokenVerify, deleteClass)

classRouter.post('/:classId/subject/:subjectId', tokenVerify, createClassSubject)
classRouter.get('/:classId/subjects', tokenVerify, getClassSubjects)
classRouter.delete('/:classId/subject/:subjectId', tokenVerify, deleteClassSubject)

module.exports = classRouter