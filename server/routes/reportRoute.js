import express from 'express';
import { addReport, deleteReport, fetchReportById, getReport, updateReport } from '../controller/report.js';
import { upload } from '../config/multer.js';

const reportRouter = express.Router();

reportRouter.post('/report', upload.single('image'), addReport);

reportRouter.get('/reports', getReport);

reportRouter.put('/report/:id', updateReport);
reportRouter.get('/report/:id', fetchReportById);

reportRouter.delete('/report/:id', deleteReport);

export default reportRouter;
