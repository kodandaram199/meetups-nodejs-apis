import express from 'express';
import {
    addSubCategory,
    getSubCategories,
    getSubCategoryById,
    editSubCategory
} from "./controller";

import { authenticate } from '../user/passportConfig'

const router = express.Router();
router.route('/sub-categories')
    .post(function (req, res, next) {
        req.isAdminModule = true;
        authenticate(req, res, next);
    }, addSubCategory)
    .get(function (req, res, next) {
        req.isAdminModule = true;
        authenticate(req, res, next);
    }, getSubCategories)
    .put(function (req, res, next) {
        req.isAdminModule = true;
        authenticate(req, res, next);
    }, editSubCategory);
router.get('/categories/:_id', function (req, res, next) {
        req.isAdminModule = true;
        authenticate(req, res, next);
    }, getSubCategoryById);

export default router;