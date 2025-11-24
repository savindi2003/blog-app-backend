const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required: function () {
            return !this.googleId;   // Google signup users → no password
        }
    },
    profilePic:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    googleId: { 
        type: String, 
        unique: true, 
        sparse: true },
})

module.exports = mongoose.model(
    "UserModel",
    userSchema
)