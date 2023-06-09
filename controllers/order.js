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
                    await req.user.createOrder({orderid : order.id, status : "PENDING"});
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
        const order = await Order.findOne({where : {orderid : order_id}});
        const promise1 = order.update({paymentid: payment_id, status : 'SUCCESSFUL'});
        const promise2 = req.user.update( {ispremium : true})

        Promise.all([promise1, promise2])
        .then( () => {
            return res.status(202).json({success : true, message : 'Transaction Successful'})
        })
        .catch( (err) => {
            return res.status(500).json({message:'Failed'});
        })
    }
    catch(err){
        return res.status(403).json({message : 'Failed'})
    }
};

exports.failedTranscation = async (req,res) => {
    
    try{
        const {payment_id, order_id} = req.body;
        const order = await Order.findOne({where : {orderid : order_id}});
        await order.update({paymentid: payment_id, status : 'FAILED'});
        return res.status(202).json({success : false, message : 'Transaction Failed'})
        // Promise.all([promise1, promise2])
        // .then( () => {
        //     return res.status(202).json({success : true, message : 'Transaction Successful'})
        // })
        // .catch( (err) => {
        //     throw new Error(err);
        // })
    }
    catch(err){
        res.status(403).json({message : 'Failed'})
    }
};