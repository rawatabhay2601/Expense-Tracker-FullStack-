const { Op } = require('sequelize');
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const { error } = require('console');

// with this we are adding User from the Sign-Up page
exports.addUser = async (req,res,next) => {

    function isvalidString(str){
        if(str.length == 0 || str == undefined){
            return false;
        }
        else{
            return true;
        }
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if( isvalidString(name) && isvalidString(email) && isvalidString(password) ){
        const saltrounds = 10;

        // ask doubts here
        bcrypt.hash(password, saltrounds, async (error , hashPass) => {
            if(error){
                return console.error(error);
            }
            try{
                const response = await Users.create({name:name,email:email,password:hashPass});
                return res.status(201).json({success:response});
            }
            catch(err){
                return res.status(500).json(err);
            }
        });
    }
    else{
        res.status(500).json({message:"Invalid Input !!"});
    }
};


exports.LogInUser = async (req,res,next) => {

    // GETTING DATA FROM THE FRONTEND
    const email = req.body.email;
    const password = req.body.password;

    // CHECKING IF A USER WITH THE EMAIL IN FRONTEND EXISTS
    const response = await Users.findOne({
        where : {email:email}
    });
    //  IF USER EXISTS
    if(!response){
        res.status(404).json({message:"No Such User Exists !!"})
    }

    else{
        bcrypt.compare(password, response.dataValues.password, (error, result) => {

            // IF PASSWORDS IS CORRECT 
            if(result){
                res.status(201).json({message:"User Login Successfully !!"})
            }
            // IF PASSWORDS IS INCORRECT
            else{
                res.status(401).json({message:"Incorrect Password !!"})
            }
            // console.log(result);
        })
    }
};