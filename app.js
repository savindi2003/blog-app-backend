//txFwUE7HD2eILssZ
//mongodb+srv://savindiduleesha_db_user:txFwUE7HD2eILssZ@blogappcluster.zcjjzu9.mongodb.net/

require('dotenv').config();

const express = require("express")
const mongoose = require("mongoose")
const router = require('./Routes/BlogRouts')
const authRouter = require('./Routes/AuthRouts')
const protected = require('./Routes/protected')
const commentRouter = require('./Routes/CommentRouts')

const cors = require('cors');
const passport = require('passport');

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Passport
require('./config/passport-google');
app.use(passport.initialize());

app.use("/api/posts",router)
app.use("/api/auth",authRouter)
app.use("/api/comment",commentRouter)
app.use('/api/protected', protected);





mongoose.connect("mongodb+srv://savindiduleesha_db_user:txFwUE7HD2eILssZ@blogappcluster.zcjjzu9.mongodb.net/")
.then(()=>console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000)
})
.catch((err)=>console.log(err))







//Register
// require('./Model/UserModel')
// const User = mongoose.model("UserModel")
// app.post("/register", async (req,res)=>{

//     const {username,email,password,profilePic,bio,role,createdAt} = req.body;

//     try {
//         await User.create({
//             username,email,password,profilePic,bio,role,createdAt
//         })
//         res.send({status:"ok"})
//     } catch (error) {
//         res.send({status:"err"})
//     }

// })
