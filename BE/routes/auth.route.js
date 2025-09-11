import express from 'express';
import { signin, signup, google, signout } from '../controllers/auth.controller.js';
import {verifyToken} from '../utils/verifyUser.js'
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout',verifyToken, signout);

export default router;
