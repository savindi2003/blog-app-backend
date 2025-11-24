const express = require('express')
const router = express.Router();
const multer = require('multer');
const { upload } = require('../config/cloudinary');

const Blog = require("../Model/PostModel")
const BlogController = require("../Controllers/PostsController")
const CommentController = require("../Controllers/CommentController")

router.get("/search/:title",BlogController.getByTitle)
router.get("/category/:category",BlogController.getByCategory)
router.get("/sort",BlogController.getAllBlogsSort)
router.get("/:id",BlogController.getById)
router.put("/:id",upload.single('coverImage'),BlogController.updateBlog)
router.delete("/:id",BlogController.deleteBlog)
router.put("/:id/like",BlogController.updateLikes)
router.post("/:postId/comment",CommentController.addComment)
router.get("/:postId/comments",CommentController.getCommentsByPost)
router.get("/",BlogController.getAllBlogs)
router.post("/",upload.single('coverImage'),BlogController.addBlog)
router.get("/author/:id",BlogController.getByAuthor)
router.get("/related/:currentId", BlogController.getRelatedBlogs);



module.exports = router;