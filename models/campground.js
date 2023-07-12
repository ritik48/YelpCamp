const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require('../models/review');

const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

imageSchema.virtual('resize').get(function () {
    return this.url.replace('/upload', '/upload/c_fill,w_500,h_300')
})

// to include virtuals data when document is converted to json. For example
// if you pass document to res.json() , virtuals will not be included by default
const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema({
    title:String,
    price: Number,
    location: String,
    description: String,
    image: [imageSchema],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);

campgroundSchema.virtual('properties.markup').get(function () {
    return `<strong>
            <a href="/campgrounds/${this._id}">${this.title}</a>
            <strong>`;
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        console.log(doc);
        await Review.deleteMany({_id: {$in: doc.reviews}});
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);



