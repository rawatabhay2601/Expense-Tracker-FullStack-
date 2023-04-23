const { Op } = require('sequelize');
const Users = require('../models/users');

// with this we are adding User from the Sign-Up page
exports.addUser = async (req,res,next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const response = await Users.create({name:name,email:email,password:password});
    res.status(201).json({UserDetails:response});
};


exports.LogInUser = async (req,res,next) => {

    const email = req.body.email;
    const password = req.body.password;

    const response = await Users.findOne({
        where : {
            [Op.and] : [
                {email:email},
                {password:password}
        ]}
    });

    if(!response){
        console.log('No such user exists !!!');
    }
    else{
        console.log('User Exists !!!');
    }
    res.status(201).json({UserDetails:response});
};

