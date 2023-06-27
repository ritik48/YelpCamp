const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground=require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const { createReview, deleteReview } = require('../controllers/review');

router.post('/', validateReview, catchAsync(createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview));


module.exports = router;
