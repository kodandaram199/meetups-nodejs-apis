import {create, read, readById, update} from "../../db/index";
import MeetUp from './model';
import { ACTIONS, RESPONSE_MESSAGES, STATUS_CODES } from "../../../constants";
import {getFormattedMessage, isIdValid} from "../../../utils";
import Category from "../category/model";
import {client, getAsync} from "../../../utils/redis";
import {del} from "../../db";

export const addMeetUp = async (req, res) => {
    try {
        const { title, description, eventDate, eventTime, location, categoryId, subCategoryId, groupId } = req.body;
        if(
            !title ||
            !description ||
            !eventDate ||
            !eventTime ||
            !location ||
            !categoryId ||
            !subCategoryId ||
            !groupId){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
        }
        const savedMeetUp = await create(MeetUp, req.body);
        const message = getFormattedMessage(ACTIONS.ADD, 'meetup');
        return successResponse(message, savedMeetUp, STATUS_CODES.CREATED);
    } catch (e) {
        log.error(e);
        return errorResponse()
    }
};

export const getMeetUps = async (req, res) => {
    try {
        const { skip, limit, groupId, categoryId, subCategoryId } = req.query;
        if(!categoryId || !subCategoryId){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
        }
        let query = {};
        if(groupId){
            query = { categoryId, subCategoryId, groupId };
        }else{
            query = { categoryId, subCategoryId };
        }
        const meetUps = await read(MeetUp, skip, limit, query);
        const message = getFormattedMessage(ACTIONS.FETCH, 'meetups');
        return successResponse(message, meetUps);
    } catch (e) {
        log.error(e);
        return errorResponse();
    }
};

export const getMeetUpById = async (req, res) => {
    try{
        const _id = req.params._id;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const meetUp = await readById(MeetUp, _id);
        const message = getFormattedMessage(ACTIONS.FETCH, 'meetup');
        return successResponse(message, meetUp);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const editMeetUp = async (req, res) => {
    try{
        const data = req.body;
        const { _id } = data;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const meetUp = await update(MeetUp, data);
        if(!meetUp){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        const message = getFormattedMessage(ACTIONS.EDIT, 'meetup');
        return successResponse(message, meetUp);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const deleteMeetUp = async (req, res) => {
    try{
        const { _id } = req.params;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const meetUp = await del(MeetUp, _id);
        if(!meetUp){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        const message = getFormattedMessage(ACTIONS.EDIT, 'category');
        return successResponse(message, meetUp);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};
