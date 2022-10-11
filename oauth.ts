import dotenv from 'dotenv';
import grant from 'grant';
// import passport from 'passport';



dotenv.config();

//grant + Google
export const grantExpress = grant.express({
    "defaults": {
        "origin": "http://localhost:8080",
        "transport": "session",
        "state": true,
    },
    "google": {
        "key": process.env.GOOGLE_CLIENT_ID || "",
        "secret": process.env.GOOGLE_CLIENT_SECRET || "",
        "scope": ["profile", "email"],
        "callback": "/user/login/google"
    },
});




// // Facebook
// const FaceBookStrategy = require('passport-facebook').Strategy;
// passport.use(new FaceBookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: "/user/auth/facebook/callback",
//     profileFields: ['public_profile', 'email']
// },
//     // function (accessToken, refreshToken, profile, cb) {
//     //     User.findOrCreate({facebookId: profile.id},function(err,user){
//     //         return cb(err,user)
//     //     })
//     //     return done(null, profile);
//     // }
// ))


// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

// module.exports = passport;