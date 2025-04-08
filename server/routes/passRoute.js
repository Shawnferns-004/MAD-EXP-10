import express from "express";
import { changePassword, sendOtp, verifyOtp } from "../controller/pass.js";

const passRouter = express.Router();

passRouter.post('/change-password', changePassword);
passRouter.post('/send-otp', sendOtp);
passRouter.post('/verify-otp', verifyOtp);

export default passRouter;