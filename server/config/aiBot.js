import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config()

const genAi = new GoogleGenerativeAI(process.env.API_BOT)
const chatmodel = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });


export default chatmodel