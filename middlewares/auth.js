const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = async (req,res,next) => {
    
    try{
        const token = req.headers['authorization'];
        const userIdObj = jwt.verify(token,process.env.ENCRYPTIONKEY);
        const user = await User.findByPk(userIdObj.userId);
        req.user = user;
        next();
    }
    catch(err){
        console.log(err);
    }
};