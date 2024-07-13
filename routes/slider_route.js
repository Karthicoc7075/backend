const express = require('express');
const  tokenVerify  = require('../middleware/tokenVerify');

const sliderRouter = express.Router();
const { uploadImage,uploadUpdateImage, allowedFormats } = require('../utils/multer');

const { createSlider, getAllSlider,getSlider, updateSlider, deleteSlider } = require('../controllers/slider_controller');

sliderRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createSlider);
sliderRouter.get('/allSliders', tokenVerify, getAllSlider);
sliderRouter.get('/:sliderId', tokenVerify, getSlider);
sliderRouter.put('/update/:SliderId', tokenVerify, uploadUpdateImage(allowedFormats.IMAGE), updateSlider);
sliderRouter.delete('/delete/:sliderId', tokenVerify, deleteSlider);

module.exports = sliderRouter;