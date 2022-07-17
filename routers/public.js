const express = require('express');
const router = express.Router();
controller = require('../controllers/public');
const locals = require('../middlewares/locals');

// for -get functions
router.get('/', locals, controller.getIndex);
router.get('/about', locals, controller.getAbout);
router.get('/contact', locals, controller.getContact);
router.get('/blog/:urlExt', locals, controller.getBlog);


module.exports = router;