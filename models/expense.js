const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const Expense = sequelize.define('expense',{
    
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    amount:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    description: {
        type: Sequelize.STRING,
        allowNull:false
    },
    type:{
        type:Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Expense;