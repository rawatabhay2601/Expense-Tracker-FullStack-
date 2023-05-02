const sequelize = require('../util/database');

exports.getLeaders = async (req,res) => {
    const [results, metadata] = await sequelize.query(`
        SELECT users.name AS name, totalExpense FROM users ORDER BY totalExpense DESC;`
    );

    return res.status(201).json({ success:results , message:'Successful' });
};