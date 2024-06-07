const Support = require('../models/support_model');

const CustomError = require('../errors');

exports.createSupport = async(req, res,next) => {
    const { title, message } = req.body;

    try{
        if(!title || !message){
            throw new CustomError('Please provide all the required fields')
        }

        const support = new Support({
            title,
            message,
            userId:req.userId 
        });

        const createSupport =await support.save();
        res.status(201).send({data:createSupport, message:'Support created successfully'})
    }catch(err){
        next(err)
    }

}

exports.getAllSupports = async(req, res) => {
    try{
        const supports = await Support.find();

        res.status(200).send({data:supports})
    }catch(err){
        next(err)
    }
}

exports.deleteSupport = async(req, res,next) => {
    const {supportId} = req.params;
    try{
        const support = await Support.findById({_id:supportId})
        
        if(!support){
            throw new CustomError('Support not found')
        }

        const deleteSupport = await Support.findByIdAndDelete({_id:supportId}, {new:true})

        res.status(200).send({data:deleteSupport, message:'Support deleted successfully'})
    }
    catch(err){
        next(err)
    }

}