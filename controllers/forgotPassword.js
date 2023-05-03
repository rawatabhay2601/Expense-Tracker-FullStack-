const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Forgotpassword = require('../models/forgotPassword');

exports.forgotPassword = async(req,res,next) => {
    
    try{
        // email ID from the frontend where email is to be delivered
        const {email} = req.body;
        console.log('Email :', email);

        const client = Sib.ApiClient.instance;  //client instance
        const apiKey = client.authentications['api-key']; // api key object
        apiKey.apiKey = process.env.SEND_EMAIL_API_KEY;   //getting the api key from .env file
    
        const tranEmailApi = new Sib.TransactionalEmailsApi();
    
        // getting user with input email ID
        const user = await User.findOne({where : {email : email}});
        
        // if user exists we will create an entry in the 
        if(user) {
            
            const id = uuid.v4();
            await user.createForgotpassword({id : id, active : true});
    
            // sender's email
            const sender = {
                email : 'rawatabhay2601@gmail.com'
            };
            
            // receiver's email
            const receivers = [
                {
                    email : email.toString()
                }
            ];

            try{
                const response = await tranEmailApi.sendTransacEmail({
                    sender,
                    to : receivers,
                    subject : "Forgot Password",
                    htmlContent : `<div>Click on the link to reset the password : </div><a href="http://localhost:3000/password/resetPassword/${id}">Reset Password</a>`
                });
                
                return res.status(201).json({success : response, message : "Successful"});
            }
            catch(err){
                return res.status(500).json({success : 'failed', message : "Failed"});
            }
        }
        else{
            alert('No Such User Exists !!');
        }
    }

    catch(err){
        return res.status(501).json({message:'Failed', success:err})
    }
};


exports.resetPassword = async (req,res,next) => {

    const id =  req.params.id;
    console.log('Hello from the reset password !!', id);

    try{
        const fgtpassword = await Forgotpassword.findOne({ where : { id : id }});

        console.log('FGT Password : ',fgtpassword);
        if(fgtpassword){
            await fgtpassword.update({ active: false});
            res.status(200).send(`<html>
                                    <script>
                                        function submitted(e){
                                            e.preventDefault();
                                        }
                                    </script>
                                    <form action="/password/updatePassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
            );
            res.end();
        }
    }
    catch(err){
        return res.status(500).json({success:err,message:'Failed'})
    }
};

exports.updatePassword = async (req,res,next) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;


        const resetPassword = await Forgotpassword.findOne({ where : { id: resetpasswordid }});
        // Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => { 
        const user = await User.findOne({where: { id : resetPassword.userId}})
        
        if(user) {

            //encrypting the password using bcrypt
            const salt = 10;
            
            bcrypt.hash(newpassword, salt, async (err, hash) => {
                
                if(err){
                    throw new Error(err);
                }
                await user.update({ password: hash });
                return res.status(201).json({message: 'Successfuly update the new password'});
            });
        }
        else{
            return res.status(404).json({ error: 'No user Exists', success: false})
        }
    }

    catch(error){
        return res.status(500).json({message : 'Failed' , success: error });
    }
};