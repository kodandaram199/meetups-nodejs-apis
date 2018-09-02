import {AUTH_TYPES, STATUS_CODES} from "../../../constants";

const passport = require('passport');
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import GooglePlusTokenStrategy from 'passport-google-plus-token';
import FacebookTokenStrategy from 'passport-facebook-token';
import User from '../user/model';
import { OAUTH, SECRET } from '../../../config';
import { create } from "../../db";

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
    secretOrKey: SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload._id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch(error) {
        done(error, false);
    }
}));

passport.use('google', new GooglePlusTokenStrategy({
    clientID: OAUTH.GOOGLE.CLIENT_ID,
    clientSecret: OAUTH.GOOGLE.CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const userData = {
            authType: AUTH_TYPES.GOOGLE,
            googleId: profile.id,
            email: profile.emails[0].value
        };
        const savedUser = await create(User, userData);
        done(null, savedUser);
    } catch(error) {
        log.error(error);
        done(error, false);
    }
}));

passport.use('facebook', new FacebookTokenStrategy({
    clientID: OAUTH.FACEBOOK.CLIENT_ID,
    clientSecret: OAUTH.FACEBOOK.CLIENT_SECRET,
    profileFields: ['id', 'emails', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('profile', profile);
        const existingUser = await User.findOne({ facebookId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const userData = {
            authType: AUTH_TYPES.FACEBOOK,
            facebookId: profile.id,
            email: profile.emails[0].value
        };
        const savedUser = await create(User, userData);
        done(null, savedUser);
    } catch(error) {
        done(error, false, error.message);
    }
}));

export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if(err){
            return errorResponse();
        }
        if(!user){
            const message = 'Unauthorized user token';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        if(req.isAdminModule && !user.isAdmin){
            const message = 'You are not authorized to access this api';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        return next();
    })(req, res, next);
};