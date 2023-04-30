const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const Users = sequelize.define('users',{
    
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email: {
        type: Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremium : {
        type:Sequelize.BOOLEAN,
        defaultValue : false
    }
});

module.exports = Users;