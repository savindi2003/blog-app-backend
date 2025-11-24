const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../Model/UserModel');

//register
const register = async (req, res) => {
    const {username,email,password,bio} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
await User.create({ username, email, password: hashedPassword, bio });

        return res.send({status:"ok"})
    } catch (error) {
        console.log(error)
        return res.send({status:"err"})
        
    }
}

//login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });


        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = (req, res) => {
    // ⚠️ මෙම function එකට පෙර passport middleware එක යෙදීම routes file එකේදී සිදුවිය යුතුය.
    
    // Passport සාර්ථකව අවසර දුන් පසු, req.user හි පරිශීලක දත්ත අඩංගු වේ.
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Option B (Recommended): Client side redirect with token in localStorage
    res.send(`
        <html>
        <body>
            <script>
            // Store token and redirect
            localStorage.setItem('token', '${token}');
            window.location = '${process.env.FRONTEND_URL}';
            </script>
        </body>
        </html>
    `);
};

const getById = async (req , res)=> {
    try {
        const user = await User.findById(req.params.id)
            .select("username email bio profilePic");

        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

//update
const updateProfile = async (req,res)=>{

    try {

        const {username , bio} = req.body;

        const updateData = {
            username,bio
        }

        if(req.file){
            updateData.profilePic = req.file.path;
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        ).select("username email bio profilePic")

        return res.json({ message: "Profile updated", user });

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Profile update failed" });
    }

}


module.exports = {
    register,
    login,
    updateProfile,
    googleAuth, // Google auth initiate කරන middleware එක
    googleCallback, // Google auth callback එකට පසු token generate කරන handler එක
    getById 
};