const express = require('express');
const app = express();
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');

app.use(cors());
app.use(bodyParser.json());

app.use(userRoute);
app.use(expenseRoute);

sequelize.sync()
.then(res => app.listen(3000))
.catch(err => console.log(err));