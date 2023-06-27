const Expense = require("../models/expense");
const User = require("../models/users");
require('dotenv').config();

// services
const S3Service = require('../services/s3Services');

function isvalidString(str){
    if(str.length == 0 || str == undefined){
        return false;
    }
    else{
        return true;
    }
};

exports.addExpense = async(req,res,next) => {

    const userId = req.user._id;
    let totalExpense = parseFloat(req.user.totalExpense);
    
    const amount = req.body.amount;
    const description = req.body.description;
    const type = req.body.type;

    if( isvalidString(amount) && isvalidString(description) && isvalidString(type) && isvalidString(userId)){
        
        try{
            // creating expense promise
            const promiseExpense = Expense.create({amount:amount, description:description, type:type, userId:userId});
            
            // updating the total expense
            totalExpense += parseInt(amount);
            req.user.totalExpense = totalExpense;

            const promiseUser =  req.user.save(); 

            const [resExpense, _] = await Promise.all([promiseExpense,promiseUser]);

            return res.status(201).json({ success:resExpense,message:'Successful'});
        }
        catch(err){
            console.log(err);
            return res.status(500).json({message:'Failed',err: err});
        }
    }
    else{
        return res.status(501).json({message:'Invalid Input Values !!'});
    }
};

exports.getExpenses = async(req,res,next) => {
    
    const page = parseInt(req.query.page);
    const ispremium = req.user.ispremium;
    const ITEMS_PER_PAGE = parseInt(req.query.perPage);
    const offset = (page-1)*ITEMS_PER_PAGE;
    const limit = ITEMS_PER_PAGE;

    try{
        // getting the count of expenses added
        const totalExpense = req.user.totalExpense;

        // response is an array
        const expensesPerPage = await Expense.find().skip(offset).limit(limit);
        return res.status(201).json({
            success : expensesPerPage,
            ispremium : ispremium,
            currentPage : page,
            hasNextPage : ITEMS_PER_PAGE*page < totalExpense,
            hasPreviousPage : page>1,
            nextPage : page+1,
            previousPage : page-1,
            lastPage : Math.ceil(totalExpense/ITEMS_PER_PAGE), 
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message:'Failed'});
    }
};

exports.deleteExpense = async (req,res,next) => {

    try{

        let totalExpense = parseInt(req.user.totalExpense);
        
        const id = req.params.expensePK;

       // calculating the new total expense
        const amt = await Expense.findOne({ _id : id });
        const amount = amt.amount;
        totalExpense = totalExpense - amount;
        
        // update total expense for the user
        req.user.totalExpense = totalExpense;
        const promiseUser = await req.user.save();
        
        // deleting expense record from the expense table
        const promiseExpense = Expense.deleteOne({ _id : id });
        
        await Promise.all([promiseExpense, promiseUser]);
        return res.status(201).json({message:'Successful'});
    }
    catch(err){
        return res.status(500).json({message:'Failed', err: err});
    }
};

// CHECK
exports.downloadExpense = async (req,res,next) => {
    try{
        const id = req.user._id;
        const expenses = await Expense.find({ _id:id });
        const stringfiedData = JSON.stringify(expenses);
        const fileName = `Expenses${req.user.id}/${JSON.stringify(new Date())}.txt`
        const fileUrl = await S3Service.uploadToS3(stringfiedData, fileName);
        req.fileUrl = fileUrl;
        next();
    }
    catch(err){
        return res.status(500).json({message : 'Failed'});
    }
};