const { Strategy } = require("passport-google-oauth20");
const User = require("../models/user.model");

const authOptions = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
};

const verifyCallback = async (accessToken, refreshToken, profile, done) => {
  console.log("Google Profile: ", profile);
  const newUser = {
    googleId: profile.id,
    displayName: profile.displayName,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    image: profile.photos[0].value,
  };

  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) {
      done(null, user);
    } else {
      user = await User.create(newUser);
      done(null, user);
    }
  } catch (err) {
    console.log(err);
  }
};

const handleAuth = (passport) => {
  passport.use(new Strategy(authOptions, verifyCallback));

  passport.serializeUser((user, done) => done(null, user));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(null, user));
  });
};

module.exports = handleAuth;
