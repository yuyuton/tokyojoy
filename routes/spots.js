const express = require('express');
const router = express.Router({ mergeParams: true});
const spots = require('../controllers/spots');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateSpot} = require('../middleware');

const Spot = require('../models/spot');

router.route('/')
    .get(catchAsync(spots.index))
    .post(isLoggedIn, validateSpot, catchAsync(spots.createSpot))

router.get('/new', isLoggedIn, spots.renderNewForm);

router.route('/:id')
    .get(catchAsync(spots.showSpot))
    .put(isLoggedIn, isAuthor, validateSpot, catchAsync(spots.updateSpot))
    .delete(isLoggedIn, isAuthor, catchAsync(spots.deleteSpot));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(spots.renderEditForm));

module.exports = router;
