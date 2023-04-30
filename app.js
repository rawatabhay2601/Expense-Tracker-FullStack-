const express = require('express');
const app = express();
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');
const Users = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');
const orderRoute = require('./routes/orderRoute');

app.use(cors());
app.use(bodyParser.json());

app.use(userRoute);
app.use(expenseRoute);
app.use(orderRoute);

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

Sequelize.sync({force : false})
    .then(res => app.listen(3000))
    .catch(err => console.log(err));