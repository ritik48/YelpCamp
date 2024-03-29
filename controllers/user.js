const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('user/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to yelpcamp');
            res.redirect('/campgrounds');
        })
    }  catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res, next) => {
    if(req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    res.render('user/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome back !!!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}