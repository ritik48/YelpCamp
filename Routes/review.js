const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground=require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

router.post('/', validateReview, catchAsync(async (req, res) => {
    const review = new Review(req.body.review);
    review.author = req.user._id;

    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Successfully added a review.')
    res.redirect(`/campgrounds/${req.params.id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    await Review.findByIdAndDelete(req.params.reviewId);
    await Campground.updateOne({_id:req.params.id}, {$pull: {reviews: req.params.reviewId}},{new: true});
    
    req.flash('success', 'Successfully deleted a review.')
    res.redirect(`/campgrounds/${req.params.id}`);
}));


module.exports = router;
