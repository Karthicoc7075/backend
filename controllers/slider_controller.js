const Slider = require('../models/slider_model');
const CustomError = require('../errors');
const { sliderImageContainerClient } = require('../services/azure/azureService');

exports.createSlider = async (req, res, next) => {
    const { title, sliderType, newsId, link, materialId, categoryId, classId } = req.body;
    try {
        if (!title || !sliderType) {
            throw new CustomError.BadRequestError('All fields are required');
        }
        
         const imageName = `${Date.now()}-${req.file.originalname}`;
        const blobClient = sliderImageContainerClient.getBlockBlobClient(imageName);
        try {
            await blobClient.upload(req.file.buffer, req.file.size);
        }
        catch (err) {
            throw new CustomError.BadRequestError('Error in uploading image');
        }

        let sliderData;

        if (sliderType == 'news') {
            sliderData = { title, image: imageName, news: newsId,sliderType };
        } else if (sliderType === 'link') {
            sliderData = { title, image: imageName, link,sliderType };
        } else if (sliderType === 'post') {
            sliderData = { title, image: imageName, post: materialId,sliderType };
        } else if (sliderType === 'category') {
            sliderData = { title, image: imageName, category: categoryId,sliderType };
        } else if (sliderType === 'class') {
            sliderData = { title, image: imageName, class: classId,sliderType };
        } else {
            throw new CustomError.BadRequestError('Invalid slider type');

        }

        const slider = new Slider(sliderData);
        const createSlider = await slider.save();
        createSlider.image = `${sliderImageContainerClient.url}/${imageName}`;
        res.status(201).json({ data: createSlider, message: 'Slider created successfully' });

    } catch (err) {
        next(err);
    }
}

exports.getAllSlider = async (req, res, next) => {
    try {
        const Sliders = await Slider.find();
        const slidersWithImage = Sliders.map((slider) => {
            slider._id = slider._id.toString();
            slider.title = slider.title;
            slider.image = `${sliderImageContainerClient.url}/${slider.image}`;
            return slider;
        })

        res.status(200).json({ data: slidersWithImage });
    } catch (err) {
        next(err);
    }
}

exports.updateSlider = async (req, res, next) => {
    const { SliderId } = req.params;
    const { title, image, sliderType, newsId, link, materialId, categoryId, classId } = req.body;
    try {
        const findSlider = await Slider.findOne({ _id: SliderId })
        if (!findSlider) {
            throw new CustomError.NotFoundError('Slider not found');
        }

        let newImageName

        if (req.file) {
            const imageName=findSlider.image ;
            const deleteBlobClient = sliderImageContainerClient.getBlockBlobClient(imageName);
            await deleteBlobClient.delete()
            newImageName = `${Date.now()}-${req.file.originalname}`;
            const blobClient = sliderImageContainerClient.getBlockBlobClient(newImageName);
           
            try {
                await blobClient.upload(req.file.buffer, req.file.size);
            } catch (err) {
                throw new CustomError.BadRequestError('Error in uploading image');
            }
            
        }

        let sliderUpdateData;


        if (sliderType === 'news') {
            sliderUpdateData = { title, image: newImageName, news: newsId };
        } else if (sliderType === 'link') {
            sliderUpdateData = { title, image: newImageName, link, };
        } else if (sliderType === 'post') {
            sliderUpdateData = { title, image: newImageName, post: materialId };
        } else if (sliderType === 'category') {
            sliderUpdateData = { title, image: newImageName, category: categoryId };
        } else if (sliderType === 'class') {
            sliderUpdateData = { title, image: newImageName, class: classId };
        } else {
            throw new CustomError.BadRequestError('Invalid slider type');

        }

        const updatedSlider = await Slider.findByIdAndUpdate({ _id: SliderId }, sliderUpdateData, { new: true })
        updatedSlider.image = `${sliderImageContainerClient.url}/${updatedSlider.image}`;
        res.status(200).json({ data: updatedSlider, message: 'Slider updated successfully' });

    } catch (err) {
        next(err);
    }

}

exports.deleteSlider = async (req, res, next) => {
    const { sliderId } = req.params;
    try {
        const findSlider = await Slider.findOne({ _id: sliderId })
        if (!findSlider) {
            throw new CustomError.NotFoundError('Slider not found');
        }

         const imageName = findSlider.image
         const deleteBlobClient = sliderImageContainerClient.getBlockBlobClient(imageName)
         await deleteBlobClient.delete()
        const deletedSlider = await Slider.findByIdAndDelete({_id:sliderId}, { new: true })
        res.status(200).json({ message: 'Slider deleted successfully', data: deletedSlider })

    } catch (err) {
        next(err);
    }
}
