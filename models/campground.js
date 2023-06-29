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
    }
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        console.log(doc);
        await Review.deleteMany({_id: {$in: doc.reviews}});
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);



