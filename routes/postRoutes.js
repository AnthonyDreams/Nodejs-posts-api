const express = require('express');
const router = express.Router();
const postController = require('../controllers/PostController');
const upload = require('../core/multerConfig.js').getStorage()

router.route('/').get(postController.getAllPost)
                 .post(upload.any(), postController.createPost)
                    

router.route('/:id')
                    .get(postController.getPost)
                    .patch(upload.any(), postController.updatePost)
                    .delete(postController.deletePost);

module.exports = router;