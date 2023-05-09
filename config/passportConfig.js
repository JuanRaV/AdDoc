import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Doctor from "../models/Doctor.js";
import jwt from 'jsonwebtoken';

// Configure passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    const doctor = await Doctor.findOne({ where: { email } });
    if (!doctor) {
      return done(null, false, { message: 'Incorrect email.' });
    }
    if (!doctor.verifyPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, doctor);
  }
));

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  function(jwt_payload, done) {
    Doctor.findByPk(jwt_payload.sub)
      .then(doctor => {
        if (doctor) {
          return done(null, doctor);
        } else {
          return done(null, false);
        }
      })
      .catch(err => done(err, false));
  }
));


passport.serializeUser((doctor, done) => {
    done(null, doctor.id);
  });
  
passport.deserializeUser(async (id, done) => {
try {  
    const doctor = await Doctor.findOne({ where: { id } });
    done(null, doctor);
} catch (error) {
    done(error);
}
});

export default passport;