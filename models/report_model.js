const mongoose = require('mongoose');


const reportSchema = new mongoose.Schema({
    postId:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Report = mongoose.model('Report', reportSchema);


module.exports = Report;