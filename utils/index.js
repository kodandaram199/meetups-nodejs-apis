import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { ACTIONS, RESPONSE_MESSAGES } from "../constants";
import { SECRET } from "../config";

export const getFormattedMessage = (actionType, message) => {
    if(actionType === ACTIONS.ADD){
        return `Successfully added ${message}`;
    }else if(actionType === ACTIONS.EDIT){
        return `Successfully edited ${message}`;
    }else if(actionType === ACTIONS.DELETE){
        return `Successfully deleted ${message}`;
    }else if(actionType === ACTIONS.FETCH){
        return `Successfully fetched ${message}`
    }else{
        return RESPONSE_MESSAGES.DEFAULT_SUCCESS_MESSAGE;
    }
};

export const isIdValid = (id) => {
    const { isValid } = mongoose.Types.ObjectId;
    return id && isValid(id);
};

export const isProductionEnvironment = () => {
    return process.env.NODE_ENV === 'production'
};

export const generateToken = (_id) => {
    return jwt.sign({ _id }, SECRET)
};