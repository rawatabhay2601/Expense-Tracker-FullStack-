const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ListOfFiles = sequelize.define('listoffiles', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = ListOfFiles;