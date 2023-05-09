const express = require('express');
const router = express.Router();


const Campground=require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas.js');

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


router.get("/", catchAsync(async (req, res) => {
    const campgrounds=await Campground.find({});
    res.render('campgrounds/home.ejs', { campgrounds });
}));

router.get("/new", (req, res) => {
    res.render('campgrounds/new.ejs');
})

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
}));

router.post('/', validateCampground,catchAsync(async (req, res) => {
    const { campground } = req.body;

    const c = new Campground(campground);
    await c.save();
    res.redirect('/campgrounds');
}));

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show.ejs', { campground });
}));

router.patch('/:id/edit', validateCampground, catchAsync(async (req, res, next) => {

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

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
}));


module.exports = router;