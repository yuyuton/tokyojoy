const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new Schema({
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    email: {
        type: String,
        required: function(){
          return !this.googleId
        },
        unique: true,
        sparse: true
    }
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
