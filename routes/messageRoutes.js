import express from 'express'
const router = express.Router();

import {sendMessage, getMessages} from '../controllers/messageController.js'
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

router.post('/send/:receiverId', authMiddleware, sendMessage);
router.get('/:id', authMiddleware, getMessages);



export default router;