import express from "express";
import {
    addGroup,
    getGroups,
    getGroupById,
    editGroup
} from "./controller";
import { authenticate } from "../user/passportConfig";

const router = express.Router();

router.route('/groups')
    .post(function (req, res, next) {
        authenticate(req, res, next);
    }, addGroup)
    .get(function (req, res, next) {
        authenticate(req, res, next);
    }, getGroups)
    .put(function (req, res, next) {
        authenticate(req, res, next);
    }, editGroup);
router.get('/categories/:_id', function (req, res, next) {
        authenticate(req, res, next);
    }, getGroupById);

export default router;