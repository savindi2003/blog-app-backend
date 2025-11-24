const Blog = require("../Model/PostModel")
const Comment = require("../Model/CommentModel")
const mongoose = require('mongoose')

//add new comment 
const addComment = async (req, res) => {
    const postId = new mongoose.Types.ObjectId(req.params.postId);
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    const content = req.body.content;

    try {
        const blog = await Blog.findById(postId);
        if (!blog) return res.status(404).json({ message: "Post not found" });

        // Create new comment
        let comment = await Comment.create({
            postId,
            userId,
            content
        });

        // Populate user fields (username, profilePic)
        comment = await comment.populate("userId", "username profilePic");

        // Add comment to blog
        blog.comments.push(comment._id);
        await blog.save();

        return res.status(201).json({
            message: "Comment added",
            comment
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};


//view all comments
const getCommentsByPost = async(req,res)=>{
     const postId = new mongoose.Types.ObjectId(req.params.postId)

     let comment;

     try {
        comment = await Comment.find({postId})
        .populate('userId', 'username profilePic')
        .sort({createdAt:-1})

        if(!comment || comment.length === 0){
            return res.status(404).json({ message: "No comments found for this post" });
        }

        return res.status(200).json({ comment });

     } catch (err) {
        return res.status(500).json({ error: err.message });
     }
}

exports.addComment = addComment
exports.getCommentsByPost = getCommentsByPost