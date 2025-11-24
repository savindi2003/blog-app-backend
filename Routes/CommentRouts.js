const express = require('express')
const router = express.Router();

const CommentController = require("../Controllers/CommentController")

router.post("/:postId/comment",CommentController.addComment)

module.exports = router