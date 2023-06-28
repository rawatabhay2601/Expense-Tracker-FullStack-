const User = require("../models/users");

exports.getLeaders = async (req,res) => {
    try{
        const user = await User.find().select('name totalExpense -_id').sort({ name : 1 });
        return res.status(201).json({ message:'Successful', success: user});
    }
    catch(err){
        return res.status(500).json({ message:'Failed' });
    }
};