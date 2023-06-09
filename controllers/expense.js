const Expense = require("../models/expense");
const sequelize = require("../util/database");
require('dotenv').config();

// services
const ExpenseService = require('../services/expenseServices');
const UserService = require('../services/UserServices');
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

    const userId = req.user.dataValues.id;
    let totalExpense = parseFloat(req.user.dataValues.totalExpense);
    
    const t = await sequelize.transaction();
    const amount = req.body.amount;
    const description = req.body.description;
    const type = req.body.type;

    if( isvalidString(amount) && isvalidString(description) && isvalidString(type) && isvalidString(userId)){
        try{
            // creating expense
            const response = await Expense.create({amount:amount, description:description, type:type, userId:userId}, {transaction:t});
            
            // updating the total expense
            totalExpense += parseFloat(amount);
            await req.user.update({totalExpense:totalExpense},{transaction:t});
            
            // transaction commit
            await t.commit();
            
            return res.status(201).json({success:response,message:'Successful'});
        }
        catch(err){
            await t.rollback();
            return res.status(500).json({message:'Failed'});
        }
    }
    else{
        return res.status(501).json({message:'Invalid Input Values !!'});
    }
};

exports.getExpenses = async(req,res,next) => {
    
    const page = parseInt(req.query.page);
    const userId = req.user.dataValues.id;
    const ispremium = req.user.dataValues.ispremium;
    const ITEMS_PER_PAGE = parseInt(req.query.perPage);

    try{
        // getting the count of expenses added
        const totalExpense = await ExpenseService.expensesCount({where : {userId : userId}});

        const params = {
            where : {userId : userId},
            offset : (page-1)*ITEMS_PER_PAGE,
            limit : ITEMS_PER_PAGE,
        };
        // response is an array
        const expensesPerPage = await ExpenseService.getExpenses(params);
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
        return res.status(500).json({ message:'Failed'});
    }
};

exports.deleteExpense = async (req,res,next) => {
    const t = await sequelize.transaction();
    try{
        let totalExpense = parseFloat(req.user.totalExpense);
        const id = req.params.expensePK;

       // calculating the new total expense
        const expense = await Expense.findOne({where : {id:id}}, {attributes : ['amount']});
        const amount = parseFloat(expense.amount);
        totalExpense = totalExpense - amount;
        
        // update with transaction
        await UserService.updateUser(req,{totalExpense : totalExpense},{transaction:t});
        
        // deleting expense record from the expense table
        await ExpenseService.deleteExpense({where : {id : id}}, {transaction:t});
        
        // transaction commit
        await t.commit();
        return res.status(201).json({message:'Successful'});
    }
    catch(err){

        // transaction rollback
        await t.rollback();
        return res.status(500).json({message:'Failed'});
    }
};

exports.downloadExpense = async (req,res,next) => {
    try{
        const expenses = await req.user.getExpenses();
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