const Campground=require('../models/campground');

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
    console.log(campground);
    if(!campground) {
        req.flash('error', 'Cannot find that campground !!!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show.ejs', { campground });
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    const c = await Campground.findByIdAndUpdate(id, {...req.body.campground});
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
    const { campground } = req.body;
    const c = new Campground(campground);
    c.author = req.user._id;

    await c.save();
    req.flash('success', 'successfully created a new campground');
    res.redirect(`/campgrounds/${c._id}`);
}