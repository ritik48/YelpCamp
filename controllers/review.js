const Campground=require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const review = new Review(req.body.review);
    review.author = req.user._id;

    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Successfully added a review.')
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.deleteReview = async(req, res) => {
    await Review.findByIdAndDelete(req.params.reviewId);
    await Campground.updateOne({_id:req.params.id}, {$pull: {reviews: req.params.reviewId}},{new: true});
    
    req.flash('success', 'Successfully deleted a review.')
    res.redirect(`/campgrounds/${req.params.id}`);
}