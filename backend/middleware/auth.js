const jwt = require('jsonwebtoken');
const config = require('config');
const constants = require('../utils/constants');

module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send(constants.ERRORS.ACCESS_DENIED);

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send(constants.ERRORS.INVALID_TOKEN);
    }
}


