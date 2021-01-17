if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const findOrCreate = require('mongoose-findorcreate');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const spotRoutes = require('./routes/spots');
const reviewRoutes = require('./routes/reviews');
const userRoutes =  require('./routes/users');

mongoose.connect('mongodb://localhost:27017/tokyoJoy', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(req, res){
  console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session({ cookie: { maxAge: 60000000 },
                  secret: 'woot',
                  resave: false,
                  saveUninitialized: false}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/tokyojoy",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id, username: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', userRoutes);
app.use('/spots', spotRoutes);
app.use('/spots/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
  console.log("Ok")
})
