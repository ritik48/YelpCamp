const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground=require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schemas');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(err => err.message).join(" ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



router.post('/', validateReview, catchAsync(async (req, res) => {
    const review = new Review(req.body.review);
    const campground = await Campground.findById(req.params.id);

    campground.reviews.push(review);

    await review.save();
    await campground.save();

    res.redirect(`/campgrounds/${req.params.id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res) => {
    await Review.findByIdAndDelete(req.params.reviewId);
    await Campground.updateOne({_id:req.params.id}, {$pull: {reviews: req.params.reviewId}},{new: true});
    
    res.redirect(`/campgrounds/${req.params.id}`);
}));


module.exports = router;
