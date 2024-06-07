const express = require('express');
const  tokenVerify  = require('../middleware/tokenVerify');

const sliderRouter = express.Router();
const { uploadImage, allowedFormats } = require('../utils/multer');

const { createSlider, getAllSlider, updateSlider, deleteSlider } = require('../controllers/slider_controller');

sliderRouter.post('/create', tokenVerify, uploadImage(allowedFormats.IMAGE), createSlider);
sliderRouter.get('/allSliders', tokenVerify, getAllSlider);
sliderRouter.put('/update/:SliderId', tokenVerify, uploadImage(allowedFormats.IMAGE), updateSlider);
sliderRouter.delete('/delete/:sliderId', tokenVerify, deleteSlider);

module.exports = sliderRouter;