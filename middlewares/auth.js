const User = require('../models/users');
const jwt = require('jsonwebtoken');
const encryptionKey = 'ijuht76gbhcqr480oklmnhgcr26';

exports.authenticate = async (req,res,next) => {
    
    try{
        const token = req.headers['authorization'];
        const userIdObj = jwt.verify(token,encryptionKey);
        const user = await User.findByPk(userIdObj.userId);
        req.user = user;
        next();
    }
    catch(err){
        console.log(err);
    }
};