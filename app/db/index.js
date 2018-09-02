// All CRUD operations

import {DEFAULT_LIMIT, DEFAULT_SKIP} from "../../constants";

/**
 *
 * @param model
 * @param data
 */
export const create = (model, data) => {
    const modelInstance = new model(data);
    return modelInstance.save();
};

/**
 *
 * @param model
 * @param skip
 * @param limit
 * @param ignorePagination
 * @param query
 * @returns {*}
 */
export const read = (model, skip = DEFAULT_SKIP, limit = DEFAULT_LIMIT, query, ignorePagination = false) => {
    let q = {};
    if(query){
        q = query;
    }
    if(ignorePagination){
        return model.find(q);
    }
    return model.find(q)
        .skip(parseInt(skip))
        .limit(parseInt(limit));
};

/**
 *
 * @param model
 * @param _id
 * @returns {Query}
 */
export const readById = (model, _id) => {
    return model.findById(_id)
};

/**
 *
 * @param model
 * @param data
 * @returns {Query}
 */
export const update = (model, data) => {
    const { _id } = data;
    return model.findByIdAndUpdate(_id, data, {new: true});
};

/**
 *
 * @param model
 * @param _id
 * @returns {Query}
 */
export const del = (model, _id) => {
    return model.findByIdAndRemove(_id);
};