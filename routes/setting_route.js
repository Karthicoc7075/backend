const Router = require('express').Router;
const {getAdsSettings,getAppSettings,createAdsSettings,createAppSettings,updateAdsSettings,updateAppSettings} = require('../controllers/setting_controller');
const settingRoute = Router();


settingRoute.get('/ads',getAdsSettings);
settingRoute.get('/app',getAppSettings);
settingRoute.post('/ads/create',createAdsSettings);
settingRoute.post('/app/create',createAppSettings);
settingRoute.put('/ads/update/:settingId',updateAdsSettings);
settingRoute.put('/app/update/:settingId',updateAppSettings);



module.exports = settingRoute;