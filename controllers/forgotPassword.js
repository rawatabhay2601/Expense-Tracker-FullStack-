exports.forgotPassword = async(req,res,next) => {
    
    const Sib = require('sib-api-v3-sdk');
    require('dotenv').config();

    const client = Sib.ApiClient.instance;  //client instance
    const apiKey = client.authentications['api-key']; // api key object
    apiKey.apiKey = process.env.SEND_EMAIL_API_KEY; //getting the api key from .env file

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email : 'rawatabhay2601@gmail.com'
    };

    const receivers = [
        {
            email : 'abhay.camberracing@gmail.com'
        },
    ];
    
    try{
        const response = tranEmailApi.sendTransacEmail({
            sender,
            to : receivers,
            subject : "Testing for new SendinBlue Email",
            textContent : `Trying the new SendinBlue email : 
            {{parmas.msg}}`,
            params : {
                msg : 'this is my message',
            },
        });
    
        return res.status(201).json({success : response, message : "Successful"});
    }
    catch(err){
        return res.status(500).json({success : 'false', message : "Failed"});
    }
};