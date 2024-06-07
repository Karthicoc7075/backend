const Language = require('../models/language_model');
const CustomError = require('../errors');
const { languageImagesContainerClient } = require('../services/azure/azureService');

exports.createLanguage = async (req, res,next) => {
    const { languageName } = req.body;
    try {
        if(!languageName  ){
            throw new CustomError.BadRequestError('All fields are required');
        }

        const languageExist = await Language.findOne({ languageName });

        if (languageExist) {
            throw new CustomError.BadRequestError('Language name already exist');
        }

        const imageName = `${Date.now()}-${req.file.originalname}`;
            const blockBlobClient = languageImagesContainerClient.getBlockBlobClient(imageName);
        
            try{
                await blockBlobClient.upload(req.file.buffer, req.file.size);
            }
            catch(err){
                throw new CustomError.InternalServerError('Failed to upload image');
            }

        const createLanguage = await Language.create({ languageName,image:imageName, createdBy: req.userId });
        createLanguage.image = languageImagesContainerClient.url + '/' + createLanguage.image;
        res.status(201).json({ data: createLanguage, message: 'Language created successfully' });
    } catch (err) {
        next(err);
    }
}

exports.getAllLanguage = async (req, res,next) => {
    try {
        
        const languages = await Language.find();
        
        const languagesWithImage = languages.map(language => {
            return {
                id: language._id,
                languageName: language.languageName,
                image: languageImagesContainerClient.url + '/' + language.image
            }
        })
         
        res.status(200).json({ data: languagesWithImage });
    } catch (err) {
        next(err);
    }
}

exports.updateLanguage = async (req, res,next) => {
    const { languageId } = req.params;
    const { languageName,image } = req.body;

    try {
        if(!languageName){
            throw new CustomError.BadRequestError('All fields are required');
        }
        
        const findLanguage = await Language.findOne({ _id: languageId })
    
        if (!findLanguage) {
           throw new CustomError.NotFoundError('Language not found');
        }

        if(findLanguage.languageName != languageName){
            const alreadyExistlanguageName = await Language.findOne({ languageName })

            if (alreadyExistlanguageName) {
                throw new CustomError.BadRequestError('Language name already exist');
            }
        }
         let newImageName;
       if(req.file){
         
        const imageName = findLanguage.image;
        const delteBlockBlobClient = languageImagesContainerClient.getBlockBlobClient(imageName);
        await delteBlockBlobClient.delete()

         newImageName = `${Date.now()}-${req.file.originalname}`;
        const uploadBlockBlobClient = languageImagesContainerClient.getBlockBlobClient(newImageName);
    
        try{
            await uploadBlockBlobClient.upload(req.file.buffer, req.file.size);
        }
        catch(err){
            throw new CustomError.InternalServerError('Failed to upload image');
        }
    }

        const updateData = req.file ? { languageName, image:newImageName } : { languageName }

        const updatedLanguage = await Language.findByIdAndUpdate({ _id: languageId },  updateData, { new: true })
         
        updatedLanguage.image = languageImagesContainerClient.url + '/' + updatedLanguage.image;

        res.status(200).json({ data: updatedLanguage, message: 'Language updated successfully' });

    } catch (err) {
        next(err);
    }

}

exports.deleteLanguage = async (req, res,next) => {
    const { languageId } = req.params;
    try {
        const findLanguage = await Language.findOne({ _id: languageId })
        if (!findLanguage) {
           throw new CustomError.NotFoundError('Language not found');
        }

        const imageName =  findLanguage.image
        const deleteBlockBlobClient = languageImagesContainerClient.getBlockBlobClient(imageName);
        await deleteBlockBlobClient.delete()



        const deletedClass = await Language.findByIdAndDelete({ _id: languageId }, { new: true })
        res.status(200).json({ message: 'Language deleted successfully', data: deletedClass })

    } catch (err) {
        next(err);
    }
}
