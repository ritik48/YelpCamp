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

app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    res.redirect('/campgrounds');
})


app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000 ....");
})