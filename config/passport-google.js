const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Model/UserModel')


passport.use(
new GoogleStrategy(
{
clientID: process.env.GOOGLE_CLIENT_ID,
clientSecret: process.env.GOOGLE_CLIENT_SECRET,
callbackURL: '/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
try {
// Find user by google id
let user = await User.findOne({ googleId: profile.id });


if (!user) {
// Create a new user
user = await User.create({
googleId: profile.id,
name: profile.displayName,
email: profile.emails && profile.emails[0] && profile.emails[0].value
});
}


return done(null, user);
} catch (err) {
return done(err, null);
}
}
)
);