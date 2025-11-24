const mongoose = require('mongoose')

const Schema = mongoose.Schema

const commentSchema = new Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"PostModel",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }

})

module.exports = mongoose.model(
    "CommentModel",
    commentSchema
)