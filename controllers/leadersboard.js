const sequelize = require('../util/database');

exports.getLeaders = async (req,res) => {
    try{
        const [results, metadata] = await sequelize.query(`
            SELECT users.name AS name, totalExpense FROM users ORDER BY totalExpense DESC;`
        );
    
        return res.status(201).json({ message:'Successful' });
    }
    catch(err){
        return res.status(500).json({ message:'Failed' });
    }
};