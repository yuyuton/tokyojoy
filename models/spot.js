const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const SpotSchema = new Schema({
  title: String,
  type: String,
  description: String,
  location: String,
  image: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectID,
      ref: 'Review'
    }
  ]
});

SpotSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Spots', SpotSchema);
