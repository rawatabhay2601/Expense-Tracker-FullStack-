const Order = require("../models/order");
const Razorpay = require('razorpay');
require('dotenv').config();

exports.purchasePremium = async (req,res) => {
    try{
        var rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret : process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 25000;

        rzp.orders.create({amount, currency:'INR'}, async (err, order) => {

            if(err){
                console.log(err);
            }
            else{
                try{
                    await Order.create({ orderid : order.id, status : "PENDING"});
                    return res.status(201).json({order, key_id : rzp.key_id})
                }
                catch(err){
                    return res.status(500).json({message:"Failed"})
                }
            }
        });
    }

    catch(err){
        res.status(501).json({message : 'Failed'});
    }
};

exports.updateTranscation = async (req,res) => {
    
    try{
        const {payment_id, order_id} = req.body;
        
        // updating the order document
        const orderPromise = Order.findOneAndUpdate({ orderid : order_id }, { paymentid: payment_id, status: 'SUCCESSFUL'});
        
        // updating the user data
        req.user.ispremium = 'true';
        const userPromise = req.user.save();
        // // order and user updating data
        // order.paymentid = payment_id;
        // order.status = 'SUCCESSFUL';
        
        return Promise.all([orderPromise, userPromise])
        .then( () => {
            return res.status(202).json({success : true, message : 'Transaction Successful'});
        })
        .catch( (err) => {
            return res.status(404).json({message : 'Failed while updating user and order', error: err});
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({message : 'Failed', err: err});
    }
};

exports.failedTranscation = async (req,res) => {
    
    try{
        const {payment_id, order_id} = req.body;
        await Order.findOneAndUpdate({orderid : order_id}, {paymentid: payment_id, status : 'FAILED'});
        return res.status(202).json({success : false, message : 'Transaction Failed'});
        // Promise.all([promise1, promise2])
        // .then( () => {
        //     return res.status(202).json({success : true, message : 'Transaction Successful'})
        // })
        // .catch( (err) => {
        //     throw new Error(err);
        // })
    }
    catch(err){
        res.status(403).json({message : 'Failed'});
    }
};