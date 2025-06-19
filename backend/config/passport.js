import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config(); // ✅ Ensure this is included

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,      // ✅ comes from .env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,  // ✅ comes from .env
  callbackURL: "/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  const existingUser = await User.findOne({ googleId: profile.id });
  if (existingUser) return done(null, existingUser);

  const newUser = await User.create({
    googleId: profile.id,
    username: profile.displayName,
    email: profile.emails[0].value,
    avatarUrl: profile.photos[0].value
  });
  done(null, newUser);
}));
