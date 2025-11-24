const express = require('express')
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
const { upload } = require('../config/cloudinary');

const AuthController = require('../Controllers/AuthController')

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../Model/UserModel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


router.post("/register",AuthController.register)
router.post("/login",AuthController.login)
router.get("/:id",AuthController.getById)
router.put("/update/:id",upload.single('profilePic'),AuthController.updateProfile)
router.get('/google', AuthController.googleAuth);
router.get(
    '/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth` }),
    AuthController.googleCallback
);


router.post('/google', async (req, res) => {
    const { token } = req.body; // Frontend sends credential

    try {
        // Verify token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        // Check if user exists
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            // Create new Google user
            user = await User.create({
                username: payload.name,
                email: payload.email,
                googleId: payload.sub
            });
        }

        // Generate JWT
        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token: jwtToken, user: { id: user._id, email: user.email, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Google sign up failed' });
    }
});

module.exports = router;