const Spot = require('../models/spot');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const https = require("https");
const weatherID = process.env.WEATHER_ID;

module.exports.index = async (req, res) => {
  const spots = await Spot.find({});
  const url = "https://api.openweathermap.org/data/2.5/onecall?lat=35.65&lon=139.84&exclude=hourly,minutely&units=metric&appid="+weatherID;
  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data)
      res.render('spots/index', { spots, weatherData })
    })
  })
};

module.exports.renderNewForm = (req, res) => {
    res.render('spots/new');
}

module.exports.createSpot = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
      query: req.body.spot.title,
      limit: 1
    }).send()
    const spot = new Spot(req.body.spot);
    spot.geometry = geoData.body.features[0].geometry;
    spot.author = req.user._id;
    await spot.save();
    req.flash('success', 'Successfully create a new spot blog!')
    res.redirect(`/spots/${spot._id}`)
}

module.exports.showSpot = async (req, res,) => {
    const spot = await Spot.findById(req.params.id).populate({
      path: 'reviews',
      populate: {
        path: 'author'
      }
    }).populate('author');
    if (!spot) {
      req.flash('error', 'Cannot find that spot!');
      return res.redirect('/spots');
    }
    res.render('spots/show', { spot });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findById(id);
    if (!spot) {
      req.flash('error', 'Cannot find that spot!');
      return res.redirect('/spots');
    }
    res.render('spots/edit', { spot });
}

module.exports.updateSpot = async (req, res) => {
    const { id } = req.params;
    const spot = await Spot.findByIdAndUpdate(id, { ...req.body.spot });
    req.flash('success', 'Successfully updated this spot!');
    res.redirect(`/spots/${spot._id}`);
}

module.exports.deleteSpot = async (req, res) => {
    const { id } = req.params;
    await Spot.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted spot!');
    res.redirect('/spots');
}
