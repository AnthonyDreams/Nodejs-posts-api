const base = require('./baseController');
const Gallery = require('../models/GalleryModel')

exports.getGallery = base.getOne(Gallery);

exports.getAllGallery = base.getAll(Gallery);

exports.createGallery = base.createOne(Gallery);

exports.deleteGallery = base.deleteOne(Gallery);


exports.updateGallery = base.updateOne(Gallery);