const express = require('express');
const app = express();

// UTILITIES
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// ROUTES
const orderRoute = require('./routes/orderRoute');
const leaderboardRoute = require('./routes/leadersboardRoute');
const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');
const forgotPasswordRoute = require('./routes/forgotPassword');
const listOfFilesRoute = require('./routes/listOfFiles');

// creating stream for logging requests
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flag : 'a'}
);

// Utility middlewares
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});
app.use(cors(
    {origin: "*"}
));
app.use(bodyParser.json());
app.use(morgan('combined', {stream : accessLogStream}));
app.use(express.static(path.join(__dirname, 'public')));


// Calling routes in these middleware
app.use(userRoute);
app.use(expenseRoute);
app.use(orderRoute);
app.use(leaderboardRoute);
app.use(forgotPasswordRoute);
app.use(listOfFilesRoute);

// FOR FRONTEND
app.use((req,res) => {
    res.sendFile(path.join(__dirname, `views/${req.url}`));
});

mongoose.connect("mongodb+srv://rawatabhay2601:rawatabhay2601@testmongo.78uqocw.mongodb.net/expense-tracker?retryWrites=true&w=majority")
    .then(res => app.listen(process.env.PORT || 3000))
    .catch(err => console.log(err))