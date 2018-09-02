import express from 'express';
import {
    addMeetUp,
    getMeetUps,
    getMeetUpById,
    editMeetUp
} from "./controller";
import { authenticate } from "../user/passportConfig";

const router = express.Router();

router.route('/meetups')
    .post(function (req, res, next) {
        authenticate(req, res, next);
    }, addMeetUp)
    .get(function (req, res, next) {
        authenticate(req, res, next);
    }, getMeetUps)
    .put(function (req, res, next) {
        authenticate(req, res, next);
    }, editMeetUp);
router.get('/categories/:_id', function (req, res, next) {
        authenticate(req, res, next);
    }, getMeetUpById);

export default router;