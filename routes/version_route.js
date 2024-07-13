const express = require('express');
const tokenVerify  = require('../middleware/tokenVerify');

const versionRouter = express.Router();

const { createVersion, getAllVersions,getVersion,updateVersion, deleteVersion } = require('../controllers/version_controller');

versionRouter.post('/create', tokenVerify, createVersion);
versionRouter.get('/allVersions', tokenVerify, getAllVersions);
versionRouter.get('/:versionId', tokenVerify, getVersion);
versionRouter.put('/update/:versionId', tokenVerify, updateVersion);
versionRouter.delete('/delete/:versionId', tokenVerify, deleteVersion);


module.exports = versionRouter;