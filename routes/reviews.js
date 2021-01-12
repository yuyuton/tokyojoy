const express = require('express');
const router = express.Router({ mergeParams: true});

const Spot = require('../models/spot');
const Review = require('../models/review');


router.post('/', async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    const review = new Review(req.body.review);
    spot.reviews.push(review);
    await review.save();
    await spot.save();
    req.flash('success', 'Thank you for your review!');
    res.redirect(`/spots/${spot._id}`);
})

router.delete('/:reviewId', async (req, res) => {
    const { id, reviewId } = req.params;
    await Spot.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully dateled your review!');
    res.redirect(`/spots/${id}`);
})

module.exports = router;
