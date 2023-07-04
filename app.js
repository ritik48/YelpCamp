if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./Routes/campground');
const reviewRoutes = require('./Routes/review');
const userRoutes = require('./Routes/users'); 

const session = require('express-session');
const flash = require('connect-flash');

const User = require('./models/user');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.set('strictQuery', false);
const path=require('path');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log("DATABASE CONNECTED."))
.catch((err) => console.log("DATABASE ERROR !!!"))

const app=express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)
 

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found !!!', 404));
})

app.use((err, req, res, next) => {
    const { status=500 } = err;
    if(!err.message) err.message = 'Something Went Wrong !!!';
    res.status(status).render('error', { err });
})


app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000 ....");
})