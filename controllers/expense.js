const Expense = require("../models/expense");

exports.addExpense = async(req,res,next) => {

    const amount = req.body.amount;
    const description = req.body.description;
    const type = req.body.type;

    function isvalidString(str){
        if(str.length == 0 || str == undefined){
            return false;
        }
        else{
            return true;
        }
    }

    try{
        if( isvalidString(amount) && isvalidString(description) && isvalidString(type) ){
            
            const response = await Expense.create({amount:amount,description:description,type:type});
            return res.status(201).json({success:response});
            
        }
        else{
            return res.status(500).json({message:'Invalid Input Values !!'});
        }
    }
    catch(err){
        console.log(err);
    }
    // console.log(amount,description,type);
    
}

exports.getAllExpenses = async(req,res,next) => {
    
    try{
        // response is an array
        const response = await Expense.findAll();
        res.status(201).json({success:response});
    }
    catch(err){
        console.log(err);
    }
};

exports.deleteExpense = async (req,res,next) => {
    try{
        const id = req.params.expensePK;
        const response = await Expense.destroy({where : {id : id}});
        res.status(201).json({success:response});
    }       
    catch(err){
        console.log(err);
    }
};