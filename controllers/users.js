const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const encryptionKey = 'ijuht76gbhcqr480oklmnhgcr26';

function isvalidString(str){
    if(str.length == 0 || str == undefined){
        return false;
    }
    else{
        return true;
    }
}

function generatetokenAccess(user){
    const userId = user
    return jwt.sign({userId : userId}, encryptionKey);
}

// with this we are adding User from the Sign-Up page
exports.addUser = async (req,res,next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if( isvalidString(name) && isvalidString(email) && isvalidString(password) ){
        const saltrounds = 10;
        // ask doubts here
        bcrypt.hash(password, saltrounds, async (error , hashPass) => {

            if(error){
                return console.log(error);
            }

            try{
                const response = await Users.create({name:name,email:email,password:hashPass});

                return res.status(201).json({success:response, message:'Successful'});
            }
            catch(err){
                return res.status(500).json({success:err,message:'Failed'});
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

    //  IF NO USER EXISTS
    if(!response){
        return res.status(404).json({message:"No Such User Exists !!"})
    }
    else{
        bcrypt.compare(password, response.dataValues.password, (error, result) => {

            // IF PASSWORDS IS CORRECT 
            if(result){
                return  res.status(201).json({message:"User Login Successfully !!", success:response , token:generatetokenAccess(response.dataValues.id)});
            }
            // IF PASSWORDS IS INCORRECT
            else{
                return res.status(401).json({message:"Incorrect Password !!"});
            }
        })
    }
};