const jwt = require('jsonwebtoken');
const CustomError = require('../errors');
const secretKey = require('../config/keys').secretKey;


const auth =(roles=[])=>{
    if(typeof roles === 'string'){
        roles = [roles];
    }
console.log(roles);
    return (req, res, next) => {
        let token = req.header('authorization')
        if (!token) return res.status(401).send('Access denied. No token provided.');
        console.log(token);
        try {
          token = token.split(' ')[1];
          const decoded = jwt.verify(token, secretKey);
          req.user = decoded;
          console.log(req.user);
          if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).send('Access denied.');
          }
          
          next();
        } catch (err) {
          res.status(400).send('Invalid token.');
        }
      };
    };
    
module.exports = auth;