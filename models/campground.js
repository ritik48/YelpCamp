const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    title:String,
    price: Number,
    location: String,
    description: String,
    image: String
});

module.exports = mongoose.model('Campground', campgroundSchema);



