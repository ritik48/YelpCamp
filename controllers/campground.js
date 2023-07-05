const { cloudinary } = require('../cloudinary');
const Campground=require('../models/campground');

const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.renderIndex = async (req, res) => {
    const campgrounds=await Campground.find({});
    res.render('campgrounds/home.ejs', { campgrounds });
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground) {
        req.flash('error', 'Cannot find that campground !!!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { campground });
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const imgs = req.files.map(f => ({"url": f.path, "filename": f.filename}));

    campground.image.push(...imgs);
    await campground.save();

    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {image: {filename: {$in : req.body.deleteImages}}}});
    }

    req.flash('success', 'Successfully updated a campground.')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);

    req.flash('success', 'Successfully deleted a campground.')
    res.redirect('/campgrounds');
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if(!campground) {
        req.flash('error', 'Cannot find that campground !!!');
        res.redirect('/campgrounds');
    }  
    res.render('campgrounds/edit.ejs', { campground });
}

module.exports.renderCreateForm = (req, res) => {
    
    res.render('campgrounds/new.ejs');
}

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    
    const { campground } = req.body;
    const c = new Campground(campground);
    c.geometry = geoData.body.features[0].geometry;

    c.author = req.user._id;
    c.image = req.files.map(f => ({"url": f.path, "filename": f.filename}));

    // console.log(c);
    await c.save();
    req.flash('success', 'successfully created a new campground');
    res.redirect(`/campgrounds/${c._id}`);
    // res.send('worke');
}