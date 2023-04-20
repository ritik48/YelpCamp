const express = require('express');
const mongoose = require('mongoose');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override');
mongoose.set('strictQuery', false);
const path=require('path');
const Campground=require('./models/campground');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
.then(() => console.log("DATABASE CONNECTED."))
.catch((err) => console.log("DATABASE ERROR !!!"))

const app=express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));

app.get('/home', (req, res) => {
    res.send('<h1>Home</h1>');
})

app.get("/campgrounds", async (req, res) => {
    const campgrounds=await Campground.find({});
    res.render('campgrounds/home.ejs', { campgrounds });
})

app.get("/campgrounds/new", (req, res) => {
    res.render('campgrounds/new.ejs');
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit.ejs', { campground });
})

app.post('/campgrounds', async (req, res) => {
    // console.log(req.body);
    const { campground } = req.body;
    const c = new Campground(campground);
    await c.save();
    res.redirect('/campgrounds');
})

app.get("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show.ejs', { campground });
})

app.patch('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;

    const { campground } = req.body;

    const c = await Campground.findByIdAndUpdate(id, {$set: {
        title: campground.title,
        location: campground.location,
        image: campground.image,
        price: campground.price,
        description: campground.description
    }});

    console.log(c);

    res.redirect('/campgrounds');

    
})

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
})


app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000 ....");
})