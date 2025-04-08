import express from 'express';
import { getMessage } from '../controller/chat.js';

const chatRouter = express.Router();

// Get chat history
chatRouter.get('/history', getMessage);

export default chatRouter;