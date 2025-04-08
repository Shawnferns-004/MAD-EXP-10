import express from "express";
import sendFirebaseNotification from "../controller/fireBase.js";

const firebaseRouter = express.Router()

firebaseRouter.post("/send-notification", async(req, res)=>{
    const result = await sendFirebaseNotification(req,res)
    return res.send(result)
})


export default firebaseRouter