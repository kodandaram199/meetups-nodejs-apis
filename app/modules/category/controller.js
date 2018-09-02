import { create, read, readById, update, del } from "../../db";
import Category from './model';
import { getFormattedMessage, isIdValid } from "../../../utils";
import { ACTIONS, RESPONSE_MESSAGES, STATUS_CODES } from "../../../constants";
import log from '../../../logger';
import { client, getAsync } from "../../../utils/redis";

export const addCategory = async (req, res) => {
    try{
        const { title, description } = req.body;
        if(!title || !description){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST)
        }
        const savedCategory = await create(Category, {title, description});
        client.set(String(savedCategory._id), JSON.stringify(savedCategory), 'EX', 60);
        client.del('categories');
        const message = getFormattedMessage(ACTIONS.ADD, 'category');
        return successResponse(message, savedCategory, STATUS_CODES.CREATED)
    }catch (e){
        log.error(e);
        return errorResponse();
    }
};

export const getCategories = async (req, res) => {
    try{
        const { skip, limit } = req.params;
        const cachedCategories = await getAsync('categories');
        if(cachedCategories){
            const message = getFormattedMessage(ACTIONS.FETCH, 'categories');
            return successResponse(message, cachedCategories);
        }
        const categories = await read(Category, skip, limit, true);
        const message = getFormattedMessage(ACTIONS.FETCH, 'categories');
        client.set('categories', JSON.stringify(categories), 'EX', 60 * 5);
        return successResponse(message, categories);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const getCategoryById = async (req, res) => {
    try{
        const _id = req.params._id;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const cachedCategory = await getAsync(_id);
        if(cachedCategory){
            const message = getFormattedMessage(ACTIONS.FETCH, 'category');
            return successResponse(message, cachedCategory);
        }
        const category = await readById(Category, _id);
        const message = getFormattedMessage(ACTIONS.FETCH, 'category');
        client.set(_id, JSON.stringify(category), 'EX', 60 * 5);
        return successResponse(message, category);
    }catch(e){
        console.error(e);
        return errorResponse();
    }
};

export const editCategory = async (req, res) => {
    try{
        const data = req.body;
        console.log(data);
        const { _id } = data;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const category = await update(Category, data);
        if(!category){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        client.set(String(_id), JSON.stringify(category), 'EX', 60);
        client.del('categories');
        const message = getFormattedMessage(ACTIONS.EDIT, 'category');
        return successResponse(message, category);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const deleteCategory = async (req, res) => {
    try{
        const { _id } = req.params;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const category = await del(Category, _id);
        if(!category){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        client.del(_id);
        client.del('categories');
        const message = getFormattedMessage(ACTIONS.EDIT, 'category');
        return successResponse(message, category);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};