const express = require('express');
const router = express.Router();


const Campground=require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas.js');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.get("/", catchAsync(async (req, res) => {
    const campgrounds=await Campground.find({});
    res.render('campgrounds/home.ejs', { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    
    res.render('campgrounds/new.ejs');
})

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if(!campground) {
        req.flash('error', 'Cannot find that campground !!!');
        res.redirect('/campgrounds');
    }  
    res.render('campgrounds/edit.ejs', { campground });
}));

router.post('/', isLoggedIn, validateCampground,catchAsync(async (req, res) => {
    const { campground } = req.body;
    const c = new Campground(campground);
    c.author = req.user._id;

    await c.save();
    req.flash('success', 'successfully created a new campground');
    res.redirect(`/campgrounds/${c._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if(!campground) {
        req.flash('error', 'Cannot find that campground !!!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { campground });
}));

router.patch('/:id/edit', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    const c = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated a campground.')
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:id",  isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted a campground.')
    res.redirect('/campgrounds');
}));


module.exports = router;