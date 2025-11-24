const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    category:{
        type:String,
        required:true
    },
    tags:{
        type:[String],
        default:[]
    },
    likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CommentModel"
    }],
    coverImage:{
        type:String,
        default:""
    },
    published:{
        type:Boolean,
        default:true
    },
    createdAt: {
         type: Date, 
         default: Date.now 
        },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
})

module.exports = mongoose.model(
    "PostModel",
    postSchema
)