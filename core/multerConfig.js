const multer = require("multer")
const multerS3 = require('multer-s3');
const AWS = require('./aws');
const s3 = new AWS.S3();

const s3Storage = multerS3({
    s3: s3,
    bucket: 'feedtesting',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        var datetimestamp = Date.now();
        var superfilename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, superfilename); //use Date.now() for unique file keys
    }
})

var InMemoryStorage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {

      var datetimestamp = Date.now();
      var superfilename = file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
      cb(null, superfilename)
    }
});




exports.getStorage = function(type){
    let storage = null
    
    switch (type) {
        case 's3':
            storage = s3Storage
            break;
    
        default:
            storage= InMemoryStorage
            break;
    }

    return multer({
        storage: storage
    
    });

     
}