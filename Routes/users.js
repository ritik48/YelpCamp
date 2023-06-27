const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

const { storeReturnTo } = require('../middleware');
const { renderRegisterForm, registerUser, renderLoginForm, loginUser, logoutUser } = require('../controllers/user');

router.route('/register')
    .get(renderRegisterForm)
    .post(catchAsync(registerUser))

router.route('/login')
    .get(renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), loginUser)

router.get('/logout', logoutUser); 

module.exports = router;