const express = require('express');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override');
const campgroundSchema = require('./schemas.js');

mongoose.set('strictQuery', false);
const path=require('path');
const Campground=require('./models/campground');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log("DATABASE CONNECTED."))
.catch((err) => console.log("DATABASE ERROR !!!"))

const app=express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(err => err.message).join(" ");
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


app.get('/home', (req, res) => {
    res.send('<h1>Home</h1>');
})

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds=await Campground.find({});
    res.render('campgrounds/home.ejs', { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
    res.render('campgrounds/new.ejs');
})

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
}));

app.post('/campgrounds', validateCampground,catchAsync(async (req, res) => {
    const { campground } = req.body;

    const c = new Campground(campground);
    await c.save();
    res.redirect('/campgrounds');
}));

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs', { campground });
}));

app.patch('/campgrounds/:id/edit', validateCampground, catchAsync(async (req, res, next) => {

    const { id } = req.params;
    const { campground } = req.body;

    const c = await Campground.findByIdAndUpdate(id, {$set: {
        title: campground.title,
        location: campground.location,
        image: campground.image,
        price: campground.price,
        description: campground.description
    }});

    res.redirect('/campgrounds');
}));

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
}));

// its next will call the next middleware which will then send status and message as response

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