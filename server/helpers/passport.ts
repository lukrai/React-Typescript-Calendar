import * as bcrypt from "bcryptjs";
import * as passport from "passport";
import * as LocalStrategy from "passport-local";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import { db } from "../models";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      failWithError: true,
    },
    (email, password, done) => {
      db.User.findOne({
        where: {
          email,
        },
      }).then(async dbUser => {
        if (!dbUser) {
          return done(new WrongCredentialsException());
        }
        const isPasswordMatching = await bcrypt.compare(password, dbUser.password);
        if (!isPasswordMatching) {
          return done(new WrongCredentialsException());
        }
        return done(null, dbUser);
      });
    },
  ),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser(async (obj, cb) => {
  cb(null, obj);
});

export default passport;
