const express = require('express');
const  tokenVerify  = require('../middleware/tokenVerify');

const reportRouter = express.Router();

const { createReport, getAllReports,solveReport, deleteReport } = require('../controllers/report_controller');

reportRouter.post('/create', tokenVerify, createReport);
reportRouter.get('/allReports', tokenVerify, getAllReports);
reportRouter.put('/solve/:reportId', tokenVerify, solveReport);
reportRouter.delete('/delete/:reportId', tokenVerify, deleteReport);

module.exports = reportRouter;