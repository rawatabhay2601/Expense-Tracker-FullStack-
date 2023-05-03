const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Forgotpassword = sequelize.define('forgotpasswords', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    userId : Sequelize.INTEGER,
    active: Sequelize.BOOLEAN
});

module.exports = Forgotpassword;