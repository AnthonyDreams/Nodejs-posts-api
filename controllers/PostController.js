const base = require('./baseController');
const Post = require('../models/PostModel')

exports.getPost = base.getOne(Post);

exports.getAllPost = base.getAll(Post);

exports.createPost = base.createOne(Post);

exports.deletePost = base.deleteOne(Post);


exports.updatePost = base.updateOne(Post);