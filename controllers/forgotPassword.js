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

        const client = Sib.ApiClient.instance;  //client instance
        const apiKey = client.authentications['api-key']; // api key object
        apiKey.apiKey = process.env.SEND_EMAIL_API_KEY;   //getting the api key from .env file
    
        const tranEmailApi = new Sib.TransactionalEmailsApi();
    
        // getting user with input email ID
        const user = await User.findOne({email : email});
        
        // if user exists we will create an entry in the 
        if(user) {
            
            const passwordId = uuid.v4();
    
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
                const passwordPromise = Forgotpassword.create({ passwordId : passwordId, active : true, userId: user._id });
                const emailPromise = tranEmailApi.sendTransacEmail({
                    sender,
                    to : receivers,
                    subject : "Forgot Password",
                    htmlContent : `<div>Click on the link to reset the password : </div><a href="http://localhost:3000/password/resetPassword/${passwordId}/${user._id}">Reset Password</a>`
                });
                
                const [_ , response] = await Promise.all([passwordPromise, emailPromise]);
                return res.status(201).json({success : response, message : "Successful"});
            }
            catch(err){
                console.log(err);
                return res.status(500).json({message : "Failed"});
            }
        }
        else{
            return alert('No Such User Exists !!');
        }
    }
    catch(err){
        return res.status(501).json({message:'Failed'})
    }
};

exports.resetPassword = async (req,res,next) => {

    const passwordId =  req.params.id;
    const userId = req.params.userId;

    try{
        await Forgotpassword.findOneAndUpdate({ passwordId: passwordId }, { active: false });
    
        res.status(200).send(`
            <html>
                
                <form action="/password/updatePassword/${userId}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>

            </html>`
        );
        return res.end();
    }
    catch(err) {
        return res.status(500).json({ message:'Failed' })
    }
};

exports.updatePassword = async (req,res,next) => {

    try {

        const { userId } = req.params;
        const { newpassword } = req.query;
        
        //encrypting the password using bcrypt
        bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (err, salt) => {

            if(err) {
                return res.status(501).json({message: 'Failed in creating salt for password', error: err});
            }
            bcrypt.hash(newpassword, salt, async (err, hash) => {
                
                if(err){
                    return res.status(502).json({message: 'Failed in creating hash password', error: err});
                }

                await User.findOneAndUpdate( { _id: userId }, { password: hash });
                res.status(201).json({message: 'Successfuly update the new password'});
                return window.location.href = '/html/expense-form.html';
            });
        });
    }

    catch(err) {

        return res.status(500).json({ message : 'Failed' });
    }
};