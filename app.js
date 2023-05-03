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
const ForgotPassword = require('./models/forgotPassword');

// ROUTES
const orderRoute = require('./routes/orderRoute');
const leaderboardRoute = require('./routes/leadersboardRoute');
const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');
const forgotPasswordRoute = require('./routes/forgotPassword')

app.use(cors());
app.use(bodyParser.json());

app.use(userRoute);
app.use(expenseRoute);
app.use(orderRoute);
app.use(leaderboardRoute);
app.use(forgotPasswordRoute);

// Users and Expense One2Many
Users.hasMany(Expense);
Expense.belongsTo(Users);

// Users and Orders One2Many
Users.hasMany(Order);
Order.belongsTo(Users);

// Users and Forgot Password One2Many
Users.hasMany(ForgotPassword);
ForgotPassword.belongsTo(Users);

Sequelize.sync({force : false})
    .then(res => app.listen(3000))
    .catch(err => console.log(err));