import express  from 'express';
import chat from '../controller/geminiBot.js';


const botRouter = express.Router()

botRouter.post("/chat", chat)
export default botRouter
