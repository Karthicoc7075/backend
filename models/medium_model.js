const mongoose = require('mongoose');

const mediumSchema = new mongoose.Schema({
        mediumName:{
            type:'String',
            required:true
        },
        image:{
            type:'String',
            required:true
        },
        createdBy:{ 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
});

const Medium = mongoose.model('Mediums', mediumSchema);

module.exports = Medium;