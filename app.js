const express = require('express');
const app = express();
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');
const Users = require('./models/users');
const Expense = require('./models/expense');

app.use(cors());
app.use(bodyParser.json());

app.use(userRoute);
app.use(expenseRoute);

Users.hasMany(Expense);
Expense.belongsTo(Users);

Sequelize.sync({force : false})
    .then(res => app.listen(3000))
    .catch(err => console.log(err));