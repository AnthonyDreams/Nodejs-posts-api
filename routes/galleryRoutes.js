const express = require('express');
const router = express.Router();
const GalleryController = require('../controllers/GalleryController');
const upload = require('../core/multerConfig.js').getStorage()



router.route('/').get(GalleryController.getAllGallery)
                 .post(upload.any(), GalleryController.createGallery)
                    

router.route('/:id')
                    .get(GalleryController.getGallery)
                    .patch(upload.any(), GalleryController.updateGallery)
                    .delete(GalleryController.deleteGallery);

module.exports = router;