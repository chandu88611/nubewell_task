import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Student from "../models/userModel.js";

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const student = await Student.findById(id);
    done(null, student);
  } catch (error) {
    done(error, null);
  }
});

 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://2a1a-2401-4900-900a-d9e9-bdff-3f49-16aa-2b1f.ngrok-free.app/profile",  
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, displayName, photos } = profile;

      try {
 
        let student = await Student.findOne({ email: emails[0].value });

        if (!student) {
 
          student = await Student.create({
            name: displayName,
            email: emails[0].value,
            profileImage: photos[0].value,
            password: "" ,  
          });
        }

        done(null, student);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

export default passport;
