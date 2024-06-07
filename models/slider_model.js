const mongoose = require('mongoose');


const sliderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    sliderType: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    link:{
        type: String,
    },
    news:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'News'
    },
   post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Material'
   },
   createdAt:{
        type: Date,
        default: Date.now
    }
});

// Create the slider model
const Slider = mongoose.model('Slider', sliderSchema);

// Export the slider model
module.exports = Slider;