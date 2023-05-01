const express = require('express');
const app = express();

// UTILITIES
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');

// MODELS
const Users = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');

// ROUTES
const orderRoute = require('./routes/orderRoute');
const leaderboardRoute = require('./routes/leadersboardRoute');
const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');

app.use(cors());
app.use(bodyParser.json());

app.use(userRoute);
app.use(expenseRoute);
app.use(orderRoute);
app.use(leaderboardRoute);

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Order);
Order.belongsTo(Users);

Sequelize.sync({force : false})
    .then(res => app.listen(3000))
    .catch(err => console.log(err));