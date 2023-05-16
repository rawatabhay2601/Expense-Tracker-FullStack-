const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Forgotpassword = require('../models/forgotPassword');
require('dotenv').config();

exports.forgotPassword = async(req,res,next) => {
    
    try{
        // email ID from the frontend where email is to be delivered
        const {email} = req.body;

        const client = Sib.ApiClient.instance;      //client instance
        const apiKey = client.authentications['api-key'];      //api key object
        apiKey.apiKey = process.env.SEND_EMAIL_API_KEY;      //getting the api key from .env file
        
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        
        // getting user with input email ID
        const user = await User.findOne({where : {email : email}});

        // if user exists we will create an entry in the 
        if(user) {
            
            const id = uuid.v4();
            await user.createForgotpassword({id : id, active : true});
            
            // sender's email
            const sender = {
                email : process.env.SENDER_EMAIL
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
                    htmlContent : `<div>Click on the link to reset the password : </div><a href="http://54.90.161.155:3000/password/resetPassword/${id}">Reset Password</a>`
                });

                return res.status(201).json({success : response, message : "Successful"});
            }
            catch(err){
                return res.status(500).json({message : "Failed",success : err});
            }
        }
        else{
            return res.status(500).json({message : "No Such User Exists",success : err});
        }
    }
    catch(err){
        return res.status(501).json({message:'Failed'})
    }
};

exports.resetPassword = async (req,res,next) => {

    const id =  req.params.id;

    try{
        const fgtpassword = await Forgotpassword.findOne({ where : { id : id }});

        if(fgtpassword){
            await fgtpassword.update({ active: false});
            return res.status(200).send(`<html>
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
        }
    }
    catch(err){
        return res.status(500).json({message:'Failed'})
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
            bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => {
                bcrypt.hash(newpassword, salt, async (err, hash) => {
                    
                    if(err){
                        return res.status(405).json({ message: 'Error creating new pasword !!'});
                    }

                    await user.update({ password: hash });
                    return res.status(201).json({message: 'Successfuly update the new password'});
                });
            });
        }
        else{
            return res.status(404).json({ message: 'No user Exists'})
        }
    }

    catch(error){
        return res.status(500).json({message : 'Failed' });
    }
};