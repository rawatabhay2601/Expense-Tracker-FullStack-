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
        where : {email:email}
    });

    if(!response){
        res.status(404).json({UserDetails:"No Such User Exists !!"})
    }
    else{
        if(response.dataValues.password == password){
            res.status(201).json({UserDetails:"User Login Successfully !!"})
        }
        else{
            res.status(401).json({UserDetails:"Incorrect Password"})
        }
    }
};