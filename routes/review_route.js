const express = require('express');
const tokenVerify  = require('../middleware/tokenVerify');

const reviewRouter = express.Router();

const { createReview, getAllReviews, deleteReview } = require('../controllers/review_controller');

reviewRouter.post('/create', tokenVerify, createReview);
reviewRouter.get('/allReviews', tokenVerify, getAllReviews);
reviewRouter.delete('/delete/:reviewId', tokenVerify, deleteReview);

module.exports = reviewRouter;