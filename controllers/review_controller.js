const Review = require('../models/review_model');

const CustomError = require('../errors');


exports.createReview = async(req, res,next) => {
    const { comment, rating, } = req.body;

    try{
        

        const review = new Review({
            comment,
            rating,
            userId:req.userId 
        });

        const createReview =await review.save();
        res.status(201).send({data:createReview, message:'Review created successfully'})
    }catch(err){
        next(err)
    }

}

exports.getAllReviews = async(req, res) => {
    try{
        const reviews = await Review.find();

        res.status(200).send({data:reviews})
    }catch(err){
        next(err)
    }
}

exports.deleteReview = async(req, res,next) => {
    const {reviewId} = req.params;
    try{
        const review = await Review.findById({_id:reviewId})
     
        if(!review){
            throw new CustomError('Review not found')
        }

        const deleteReview = await Review.findByIdAndDelete({_id:reviewId}, {new:true})
        res.status(200).send({data:deleteReview, message:'Review deleted successfully'})
    }
    catch(err){
        next(err)
    }

}