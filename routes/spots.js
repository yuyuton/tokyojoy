const express = require('express');
const router = express.Router({ mergeParams: true});

const Spot = require('../models/spot');
const Review = require('../models/review');


router.get('/', async (req, res) => {
  const spots = await Spot.find({});
  res.render('spots/index', { spots })
});

router.get('/new', (req, res) => {
    res.render('spots/new');
})

router.post('/', async (req, res) => {
    const spot = new Spot(req.body.spot);
    await spot.save();
    req.flash('success', 'Successfully create a new spot blog!')
    res.redirect(`/spots/${spot._id}`)
})

router.get('/:id', async (req, res,) => {
    const spot = await Spot.findById(req.params.id).populate('reviews');
    res.render('spots/show', { spot });
});

router.get('/:id/edit', async (req, res) => {
    const spot = await Spot.findById(req.params.id);
    res.render('spots/edit', { spot });
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    req.flash('success', 'Successfully updated this spot!');
    res.redirect(`/spots/${spot._id}`);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted spot!');
    res.redirect('/spots');
})


module.exports = router;
