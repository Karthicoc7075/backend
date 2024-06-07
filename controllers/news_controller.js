const News = require('../models/news_model');
const CustomError = require('../errors');
const { newsImageContainerClient} = require('../services/azure/azureService');
const { find } = require('../models/category_model');


exports.createNews = async(req, res,next) => {
    const { title, content,languageId, categoryId } = req.body;

   try{
    if(!title || !content || !languageId || !categoryId ){
        throw new CustomError.BadRequestError('Please provide all the required fields')
    }

    const findNews = await News.findOne({title})
    if(findNews){
        throw new CustomError.BadRequestError('News with this title already exists')
    }

    const imageName = `${Date.now()}-${req.file.originalname}`;
    const blobClient = newsImageContainerClient.getBlockBlobClient(imageName);
     try{
        await blobClient.upload(req.file.buffer,req.file.size);
     }  catch(err){
        throw new CustomError.BadRequestError('Error in uploading image')
     }

    const news = new News({
        title,
        content,
        language:languageId,
        image:imageName,
        category:categoryId,
        createdBy:req.userId 
    });

    const createdNews =await news.save();
    news.image = `${newsImageContainerClient.url}/${imageName}`;
    res.status(201).send({data:createdNews, message:'News created successfully'})
   }catch(err){
    next(err)
}
}

exports.getAllNews = async(req, res) => {
    try{
        const news = await News.find();
        

         news.forEach((news) => {
            news.image = `${newsImageContainerClient.url}/${news.image}`;
        });



        res.status(200).send({data:news})
    }catch(err){
        next(err)
    }
}


exports.updateNews = async(req, res,next) => {
    const { title, content,languageId, categoryId,image } = req.body;
    const { newsId} = req.params;

    try{
        
    
        const findNews = await News.findOne({_id:newsId})
        if(!findNews){
            throw new CustomError.BadRequestError('News with this id does not exists')
        }
        
        let newImageName;
        if(req.file){
            const imageName = findNews.image;
        const deleteBlobClient = newsImageContainerClient.getBlockBlobClient(imageName);
        await deleteBlobClient.delete();

         newImageName = `${Date.now()}-${req.file.originalname}`;
        const blobClient = newsImageContainerClient.getBlockBlobClient(newImageName);
         try{
            await blobClient.upload(req.file.buffer,req.file.size);
         }  catch(err){
            throw new CustomError.BadRequestError('Error in uploading image')
         }
        }

        const updateData = req.file ? {title, content,language:languageId, category:categoryId,image:newImageName} : {title, content,language:languageId, category:categoryId};
    
        const updatedNews = await News.findByIdAndUpdate({_id:newsId}, updateData,{new:true})
      
        updatedNews.image = `${newsImageContainerClient.url}/${updatedNews.image}`;
        res.status(201).send({data:updatedNews, message:'News updated successfully'})
       }catch(err){
        next(err)
    }
}


exports.deleteNews = async(req, res,next) => {
    const { newsId} = req.params;
    const {image} = req.body

    try{
        const findNews = await News.findOne({_id:newsId})
        if(!findNews){
            throw new CustomError.BadRequestError('News with this id does not exists')
        }

        const imageName =findNews.image;
        const deleteBlobClient = newsImageContainerClient.getBlockBlobClient(imageName);
        await deleteBlobClient.delete();

        const deletedNews = await News.findByIdAndDelete({_id:newsId})
        res.status(200).send({data:deletedNews,message:'News deleted successfully'})
    }catch(err){
        next(err)
    }


}

exports.statusUpdate = async(req, res,next) => {
    const { newsId} = req.params;
    const { status } = req.body;

    try{
      

        const findNews = await News.findOne({_id:newsId})
        if(!findNews){
            throw new CustomError.BadRequestError('News with this id does not exists')
        }

        const updatedNews = await News.findByIdAndUpdate({_id:newsId}, {status},{new:true})
        res.status(200).send({data:updatedNews, message:'News status updated successfully'})
    }catch(err){
        next(err)
    }
}