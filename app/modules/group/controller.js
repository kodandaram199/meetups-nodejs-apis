import { create, read, readById, update } from "../../db/index";
import Group from './model';
import { ACTIONS, RESPONSE_MESSAGES, STATUS_CODES } from "../../../constants";
import {getFormattedMessage, isIdValid} from "../../../utils";
import {client} from "../../../utils/redis";
import SubCategory from "../subCategory/model";
import {del} from "../../db";


export const addGroup = async (req, res) => {
    try{
        const { title, description, categoryId, subCategoryId } = req.body;
        if(!title || !description || !categoryId || !subCategoryId){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST)
        }
        const savedGroup = await create(Group, { title, description, categoryId, subCategoryId });
        const message = getFormattedMessage(ACTIONS.ADD, 'group');
        return successResponse(message, savedGroup, STATUS_CODES.CREATED);
    }catch (e){
        log.error(e);
        return errorResponse();
    }
};

export const getGroups = async (req, res) => {
    try{
        const { skip, limit, categoryId, subCategoryId } = req.query;
        if(!categoryId){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
        }
        let query = {};
        if(categoryId){
            if(subCategoryId){
                query = { subCategoryId, categoryId };
            }else{
                query = { categoryId };
            }
        }
        const groups = await read(Group, skip, limit, query);
        const message = getFormattedMessage(ACTIONS.FETCH, 'groups');
        return successResponse(message, groups);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const getGroupById = async (req, res) => {
    try{
        const _id = req.params._id;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const group = await readById(Group, _id);
        const message = getFormattedMessage(ACTIONS.FETCH, 'group');
        return successResponse(message, group);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const editGroup = async (req, res) => {
    try{
        const data = req.body;
        const { _id } = data;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const editedGroup = await update(Group, data);
        if(!editedGroup){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        const message = getFormattedMessage(ACTIONS.EDIT, 'group');
        return successResponse(message, editedGroup);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const deleteGroup = async (req, res) => {
    try{
        const { _id } = req.params;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const deletedGroup = await del(Group, _id);
        if(!deletedGroup){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        const message = getFormattedMessage(ACTIONS.EDIT, 'group');
        return successResponse(message, deletedGroup);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};
