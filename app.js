const express = require('express');
const app = express();
const sequelize = require('./util/database');
const bodyParser = require('body-parser');
const cors = require('cors');
const signUpRoute = require('./routes/addUserSignup');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());
app.use(signUpRoute);

sequelize.sync()
.then(res => app.listen(3000))
.catch(err => console.log(err));