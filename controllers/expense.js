const Expense = require("../models/expense");

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

    const amount = req.body.amount;
    const description = req.body.description;
    const type = req.body.type;

    try{

        if( isvalidString(amount) && isvalidString(description) && isvalidString(type) && isvalidString(userId)){
            
            // updating the total expense
            totalExpense += parseFloat(amount);
            await req.user.update({totalExpense:totalExpense});


            const response = await Expense.create({amount:amount, description:description, type:type, userId:userId});
            return res.status(201).json({success:response,message:'Successful'});
        }
        else{
            return res.status(500).json({message:'Invalid Input Values !!'});
        }
    }
    catch(err){
        console.log(err);
    }
};


exports.getAllExpenses = async(req,res,next) => {

    const userId = req.user.dataValues.id;
    const ispremium = req.user.dataValues.ispremium;

    try{
        // response is an array
        const response = await Expense.findAll({ where : {userId : userId} });
        return res.status(201).json({success:response, ispremium : ispremium});
    }
    catch(err){
        console.log(err);
    }
};

exports.deleteExpense = async (req,res,next) => {

    try{

        let totalExpense = parseFloat(req.user.totalExpense);
        const id = req.params.expensePK;

        // updating total expense in user table
        const expense = await Expense.findOne({where : {id:id}}, {attributes : ['amount']});
        const amount = parseFloat(expense.amount);
        totalExpense = totalExpense - amount;
        await req.user.update({totalExpense : totalExpense});

        // deleting expense record from the expense table
        await Expense.destroy({where : {id : id}});
        return res.status(201).json({success:'true', message:'Successful'});
    }
    catch(err){
        console.log(err);
    }
};