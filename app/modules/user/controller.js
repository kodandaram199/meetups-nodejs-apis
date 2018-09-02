import passport from 'passport';
import { create, read, readById, update } from "../../db";
import User from './model';
import {ACTIONS, AUTH_TYPES, RESPONSE_MESSAGES, STATUS_CODES} from "../../../constants";
import { generateToken, getFormattedMessage } from "../../../utils";
import userResponse from "./userResponse";

export const signUp = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;
        if(
            !firstName ||
            !lastName ||
            !email ||
            !password
        ){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
        }
        const user = await User.findOne({email});
        if(user){
            const message = 'User with email already exists';
            return errorResponse(message, STATUS_CODES.BAD_REQUEST);
        }
        const registeredUser = await create(User, { firstName, lastName, email, password, authType: AUTH_TYPES.LOCAL });
        const token = generateToken(registeredUser._id);
        const data = {...registeredUser.toObject(), token };
        const message = 'User successfully registered';
        return successResponse(message, data, STATUS_CODES.CREATED)
    }catch (e){
        log.error('In sign up', e);
        return errorResponse();
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.findOne({email: username});
        console.log(user);
        if(!user){
            const message = 'Login username or password invalid';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        const validPassword = await user.isValidPassword(password, user.password);
        console.log(validPassword);
        if(!validPassword){
            const message = 'Login username or password invalid';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        const response = userResponse(user.toObject(), true);
        return successResponse('Successfully logged in', response);
    }catch (e) {
        return errorResponse();
    }
};

export const oauthGoogle = async (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if(err){
            log.error(err);
            return errorResponse();
        }
        if(!user){
            const message = 'Unauthorized user token';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        const response = userResponse(user.toObject(), true);
        return successResponse('Successfully logged in', response);
    })(req, res, next);
};

export const oauthFacebook = async (req, res, next) => {
    passport.authenticate('facebook', { session: false,  scope:'emails' }, (err, user, info) => {
        if(err){
            log.error(err);
            return errorResponse();
        }
        if(!user){
            const message = 'Unauthorized user token';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        const response = userResponse(user.toObject(), true);
        return successResponse('Successfully logged in', response);
    })(req, res, next);
};

export const oauthGithub = async (req, res) => {
    const { username, password } = req.body;
    try{
        const user = await User.findOne({email: username});
        if(!user){
            const message = 'Login username or password invalid';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        const validPassword = await user.isValidPassword(password, user.password);
        console.log(validPassword);
        if(!validPassword){
            const message = 'Login username or password invalid';
            return errorResponse(message, STATUS_CODES.UNAUTHORISED);
        }
        const response = userResponse(user.toObject(), true);
        return successResponse('Successfully logged in', response);
    }catch (e) {
        return errorResponse();
    }
};

export const getUserById = async (req, res) => {
    const { _id } = req.params;
    try{
        const user = await readById(User, _id);
        const response = userResponse(user.toObject());
        const message = getFormattedMessage(ACTIONS.FETCH, 'user');
        return successResponse(message, response);
    }catch(e){
        errorResponse();
    }
};

export const editUser = async (req, res) => {
    const {
        firstName,
        lastName,
        email
    } = req.body;
    try{
        const editedUser = await update(User, req.body);
const message = getFormattedMessage(ACTIONS.EDIT, 'user');
        return successResponse(message, editedUser);
    }catch (e) {
        return errorResponse();
    }
};
