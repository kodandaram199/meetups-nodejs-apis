import express from 'express';
import {
    addCategory,
    getCategories,
    getCategoryById,
    editCategory
} from "./controller";

import { authenticate } from '../user/passportConfig'

const router = express.Router();
router.route('/categories')
      .post(function (req, res, next) {
          req.isAdminModule = true;
          authenticate(req, res, next);
      }, addCategory)
      .get(function (req, res, next) {
          req.isAdminModule = true;
          authenticate(req, res, next);
      }, getCategories)
      .put(function (req, res, next) {
          req.isAdminModule = true;
          authenticate(req, res, next);
      }, editCategory);
router.get('/categories/:_id', function (req, res, next) {
            req.isAdminModule = true;
            authenticate(req, res, next);
        }, getCategoryById);

export default router;