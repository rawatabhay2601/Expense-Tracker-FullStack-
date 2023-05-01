const sequelize = require('../util/database');

exports.getLeaders = async (req,res) => {
    const [results, metadata] = await sequelize.query(`
        SELECT users.name , SUM(expenses.amount) AS totalExpense FROM users JOIN expenses ON users.id = expenses.userId GROUP BY expenses.userId ORDER BY totalExpense DESC;`
    );

    return res.status(201).json({message:'Successful', success:results});
};