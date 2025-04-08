import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoute.js';
import reportRouter from './routes/reportRoute.js';
import configureCloudinary from './config/cloudinary.js';
import connectDB from './config/mongoDb.js';
import dotenv from "dotenv";
import adminRouter from './routes/adminRoute.js';
import http from "http";
import { Server } from 'socket.io';
import chatRouter from './routes/chatRoute.js';
import { handleConnection } from './controller/chat.js';
import passRouter from './routes/passRoute.js';
// import firebaseRouter from './routes/firebaseRoute.js';
import botRouter from './routes/aiRoute.js';
// import Middleware from 'i18next-http-middleware';
import i18next from './config/i18n.js';
import Middleware from 'i18next-http-middleware';
import path from 'path';
import fs from "fs"

const __dirname = path.resolve()

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

handleConnection(io)

app.set("io", io);

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


app.use(Middleware.handle(i18next))
// Connect to MongoDB and Cloudinary 
connectDB();
configureCloudinary();

app.use('/api', reportRouter);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);
app.use('/api/pass', passRouter);
// app.use('/api/firebase', firebaseRouter)
app.use('/api', botRouter)

app.get("/greet",(req, res) => {
  app.get("/greet", (req, res) => {
    console.log(req.query); // Check if the parameter is being received
    res.json({ message: "Testing..." });
});
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
