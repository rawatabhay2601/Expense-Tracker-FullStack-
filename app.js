const express = require('express');
const app = express();

// UTILITIES
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MODELS
const Users = require('./models/users');
const Expense = require('./models/expense');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotPassword');
const ListOfFiles = require('./models/listDownloadFile');

// ROUTES
const orderRoute = require('./routes/orderRoute');
const leaderboardRoute = require('./routes/leadersboardRoute');
const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');
const forgotPasswordRoute = require('./routes/forgotPassword')
const listOfFilesRoute = require('./routes/listOfFiles');

// creating stream for logging requests
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flag : 'a'}
);

// Utility middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined', {stream : accessLogStream}));
app.use(helmet());

// Calling routes in these middleware
app.use(userRoute);
app.use(expenseRoute);
app.use(orderRoute);
app.use(leaderboardRoute);
app.use(forgotPasswordRoute);
app.use(listOfFilesRoute);

// for frontend
app.use((req,res) => {
    res.sendFile(path.join(__dirname, `html/${req.url}`));
});

// Users and Expense One2Many
Users.hasMany(Expense);
Expense.belongsTo(Users);

// Users and Orders One2Many
Users.hasMany(Order);
Order.belongsTo(Users);

// Users and Forgot Password One2Many
Users.hasMany(ForgotPassword);
ForgotPassword.belongsTo(Users);

// Users and List of Downloaded Files One2Many
Users.hasMany(ListOfFiles);
ListOfFiles.belongsTo(Users);

Sequelize.sync({force : false})
    .then(res => app.listen(process.env.PORT || 3000))
    .catch(err => console.log(err))