import express from 'express';
import { authenticate } from "./passportConfig";
import {
    signUp,
    login,
    oauthGoogle,
    oauthFacebook,
    oauthGithub,
    getUserById,
    editUser
} from "./controller";


const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/oauth/google', oauthGoogle);
router.post('/oauth/facebook', oauthFacebook);
router.post('/oauth/github', oauthGithub);
router.put('/profile/edit', authenticate, editUser);
router.get('/user/:_id', authenticate, getUserById);

export default router;