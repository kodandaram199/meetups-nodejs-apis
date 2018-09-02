import { create, read, readById, update, del } from "../../db";
import SubCategory from './model';
import { getFormattedMessage, isIdValid } from "../../../utils";
import { ACTIONS, RESPONSE_MESSAGES, STATUS_CODES } from "../../../constants";
import { client, getAsync } from "../../../utils/redis";

export const addSubCategory = async (req, res) => {
    try{
        const { title, description, categoryId } = req.body;
        if(!title || !description || !categoryId){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
        }
        const savedSubCategory = await create(SubCategory, {title, description});
        client.set(String(savedSubCategory._id), JSON.stringify(savedSubCategory), 'EX', 60);
        client.del(`subcategories${categoryId}`);
        const message = getFormattedMessage(ACTIONS.ADD, 'sub category');
        return successResponse(message, savedSubCategory, STATUS_CODES.CREATED);
    }catch (e){
        log.error(e);
        return errorResponse();
    }
};

export const getSubCategories = async (req, res) => {
    try{
        const { skip, limit, categoryId } = req.params;
        if(!categoryId){
            return errorResponse(RESPONSE_MESSAGES.MISSING_FIELDS, STATUS_CODES.BAD_REQUEST);
        }
        const cachedSubCategories = await getAsync(`subcategories${categoryId}`);
        if(cachedSubCategories){
            const message = getFormattedMessage(ACTIONS.FETCH, 'sub categories');
            return successResponse(message, cachedSubCategories);
        }
        const subCategories = await read(SubCategory, skip, limit, { categoryId }, true);
        const message = getFormattedMessage(ACTIONS.FETCH, 'sub categories');
        client.set(`subcategories${categoryId}`, JSON.stringify(subCategories), 'EX', 60 * 5);
        return successResponse(message, subCategories);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const getSubCategoryById = async (req, res) => {
    try{
        const _id = req.params._id;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const cachedSubCategory = await getAsync(_id);
        if(cachedSubCategory){
            const message = getFormattedMessage(ACTIONS.FETCH, 'sub category');
            return successResponse(message, cachedSubCategory);
        }
        const subCategory = await readById(SubCategory, _id);
        const message = getFormattedMessage(ACTIONS.FETCH, 'sub category');
        client.set(_id, JSON.stringify(subCategory), 'EX', 60 * 5);
        return successResponse(message, subCategory);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const editSubCategory = async (req, res) => {
    try{
        const data = req.body;
        const { _id } = data;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const editedSubCategory = await update(SubCategory, data);
        if(!editedSubCategory){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        client.set(String(_id), JSON.stringify(editedSubCategory), 'EX', 60);
        client.del(`subcategories${editedSubCategory.categoryId}`);
        const message = getFormattedMessage(ACTIONS.EDIT, 'sub category');
        return successResponse(message, editedSubCategory);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};

export const deleteSubCategory = async (req, res) => {
    try{
        const { _id } = req.params;
        if(!isIdValid(_id)){
            return errorResponse(RESPONSE_MESSAGES.INVALID_REQUEST, STATUS_CODES.BAD_REQUEST);
        }
        const deletedSubCategory = await del(SubCategory, _id);
        if(!deletedSubCategory){
            return errorResponse(RESPONSE_MESSAGES.NO_MATCH, STATUS_CODES.NOT_FOUND)
        }
        client.del(_id);
        client.del(`subcategories${deletedSubCategory.categoryId}`);
        const message = getFormattedMessage(ACTIONS.EDIT, 'sub category');
        return successResponse(message, deletedSubCategory);
    }catch(e){
        log.error(e);
        return errorResponse();
    }
};