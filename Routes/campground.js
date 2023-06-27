const express = require('express');
const router = express.Router();

const { renderIndex, showCampground, 
    editCampground, deleteCampground, 
    renderEditForm, renderCreateForm, 
    createCampground } = require('../controllers/campground');

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(renderIndex))
    .post(isLoggedIn, validateCampground, catchAsync(createCampground))

router.get("/new", isLoggedIn, renderCreateForm)

router.route('/:id')
    .get(catchAsync(showCampground))
    .patch(isLoggedIn, isAuthor, validateCampground, catchAsync(editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;