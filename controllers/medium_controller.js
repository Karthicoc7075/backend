const Medium = require('../models/medium_model');
const CustomError = require('../errors');
const { mediumImagesContainerClient } = require('../services/azure/azureService');

exports.createMedium = async (req, res, next) => {
    const { mediumName } = req.body;
    try {
        if (!mediumName) {
            throw new CustomError.BadRequestError('All fields are required');
        }


        const mediumExist = await Medium.findOne({ mediumName });

        if (mediumExist) {
            throw new CustomError.BadRequestError('Medium name already exist');
        }
        
        const imageName = `${Date.now()}-${req.file.originalname}`;
        const blockBlobClient = mediumImagesContainerClient.getBlockBlobClient(imageName);

        try {
            await blockBlobClient.upload(req.file.buffer, req.file.size);
        }
        catch (err) {
            throw new CustomError.InternalServerError('Failed to upload image');
        }

        const createMedium = await Medium.create({ mediumName, image: imageName, createdBy: req.userId  });
        createMedium.image = mediumImagesContainerClient.url + '/' + createMedium.image;
        res.status(201).json({ data: createMedium, success: true, message: 'Medium created successfully' });
    } catch (err) {
        next(err);
    }
}

exports.getAllMedium = async (req, res, next) => {
    try {
        const mediums = await Medium.find();

        const mediumsWithImage = mediums.map(medium => {
            return { 
                id: medium._id,
                mediumName: medium.mediumName,
                image: mediumImagesContainerClient.url + '/' + medium.image
            }
        })


        res.status(200).json({ data: mediumsWithImage });
    } catch (err) {
        next(err);
    }
}

exports.updateMedium = async (req, res, next) => {
    const { mediumId } = req.params;
    const { mediumName, image } = req.body;
    try {
        const findMedium = await Medium.findOne({ _id: mediumId })
        if (!findMedium) {
            throw new CustomError.NotFoundError('Medium not found');
        }

        if (findMedium.mediumName != mediumName) {
            const alreadyExistMediumName = await Medium.findOne({ mediumName })

            if (alreadyExistMediumName) {
                throw new CustomError.BadRequestError('Medium name already exist');
            }
        }
        let newImageName;
        if (req.file) {

            const imageName = image.split('/').pop();
            const delteBlockBlobClient = mediumImagesContainerClient.getBlockBlobClient(imageName);
            await delteBlockBlobClient.delete()

            newImageName = `${Date.now()}-${req.file.originalname}`;
            const uploadBlockBlobClient = mediumImagesContainerClient.getBlockBlobClient(newImageName);

            try {
                await uploadBlockBlobClient.upload(req.file.buffer, req.file.size);
            }
            catch (err) {
                throw new CustomError.InternalServerError('Failed to upload image');
            }
        }

        const updateData = req.file ? { mediumName, image: newImageName } : { mediumName }


        const updatedMedium = await Medium.findByIdAndUpdate({ _id: mediumId }, updateData, { new: true })
        updateData.image = mediumImagesContainerClient.url + '/' + updateData.image;
        res.status(200).json({ data: updatedMedium, message: 'Medium updated successfully' });

    } catch (err) {
        next(err)
    }

}

exports.deleteMedium = async (req, res,next) => {
    const { mediumId } = req.params;
    try {
        const findMedium = await Medium.findOne({ _id: mediumId })
        if (!findMedium) {
            throw new CustomError.NotFoundError('Medium not found');
        }

        const imageName =  findMedium.image
        const deleteBlockBlobClient = mediumImagesContainerClient.getBlockBlobClient(imageName);
        await deleteBlockBlobClient.delete()


        const deletedClass = await Medium.findByIdAndDelete({ _id: mediumId }, { new: true })
        res.status(200).json({ message: 'Medium deleted successfully', data: deletedClass })

    } catch (err) {
        next(err)
    }
}