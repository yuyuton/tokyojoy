const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpotSchema = new Schema({
  title: String,
  type: String,
  description: String,
  location: String,
  image: String
});

module.exports = mongoose.model('Spots', SpotSchema);
