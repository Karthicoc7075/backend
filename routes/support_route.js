const express = require('express');
const tokenVerify  = require('../middleware/tokenVerify');

const supportRouter = express.Router();

const { createSupport, getAllSupports, deleteSupport } = require('../controllers/support_controller');

supportRouter.post('/create', tokenVerify, createSupport);
supportRouter.get('/allSupports', tokenVerify, getAllSupports);
supportRouter.delete('/delete/:supportId', tokenVerify, deleteSupport);

module.exports = supportRouter;

