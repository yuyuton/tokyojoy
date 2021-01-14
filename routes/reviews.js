const express = require('express');
const router = express.Router({ mergeParams: true});

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const Spot = require('../models/spot');
const Review = require('../models/review');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success', 'Thank you for your review!');
    res.redirect(`/spots/${spot._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully dateled your review!');
    res.redirect(`/spots/${id}`);
}));

module.exports = router;
