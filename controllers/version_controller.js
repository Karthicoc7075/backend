const Version = require('../models/version_model');
const CustomError = require('../errors');

exports.createVersion = async(req, res,next) => {
    const { title, code, message } = req.body;

    try{
        if(!title || !code || !message){
            throw new CustomError('Please provide all the required fields')
        }

        const version = new Version({
            title,
            code,
            message,
        });

        const createVersion =await version.save();
        res.status(201).send({data:createVersion, message:'Version created successfully'})
    }catch(err){
        next(err)
    }

}


exports.getAllVersions = async(req, res) => {
    try{
        const versions = await Version.find();

        res.status(200).send({data:versions})
    }catch(err){
        next(err)
    }
}

exports.updateVersion = async(req, res,next) => {
    const {versionId} = req.params;
    const { title, code, message,status } = req.body;

    try{

        if(!title || !code || !message ){
            throw new CustomError.BadRequestError('All fields required')
        }

        const version = await Version.findById({_id:versionId})

        if(!version){
            throw new CustomError('Version not found')
        }

        const updateVersion = await Version.findByIdAndUpdate({_id:versionId}, {title, code, message,status}, {new:true})

        res.status(200).send({data:updateVersion, message:'Version updated successfully'})
    }
    catch(err){
        next(err)
    }
}

exports.deleteVersion = async(req, res,next) => {
    const {versionId} = req.params;
    try{
        const version = await Version.findById({_id:versionId})

        if(!version){
            throw new CustomError('Version not found')
        }

        const deleteVersion = await Version.findByIdAndDelete({_id:versionId}, {new:true})
        res.status(200).send({data:deleteVersion, message:'Version deleted successfully'})
    }catch(err){
        next(err)
    }

}

