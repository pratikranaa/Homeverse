const express = require('express');
const router = express.Router();
const ContentController = require('../controllers/ContentController');

// Content endpoints
router.get('/buyer-landing', ContentController.getBuyerLanding.bind(ContentController));
router.get('/seller-landing', ContentController.getSellerLanding.bind(ContentController));
router.get('/about', ContentController.getAbout.bind(ContentController));
router.get('/contact', ContentController.getContact.bind(ContentController));
router.get('/home', ContentController.getHome.bind(ContentController));

module.exports = router;
