const jwt = require('jsonwebtoken');
const CustomError = require('../errors');
const secretKey = require('../config/keys').secretKey;
const tokenVerify = (req, res, next) => {   
    const token = req.Authorization || req.headers['authorization'];

  console.log(token);
    if (!token) {
        return next(new CustomError.UnauthorizedError('Access denied'));
    }
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return next(new CustomError.UnauthorizedError('Invalid token'));
    }

    
}

module.exports = tokenVerify;